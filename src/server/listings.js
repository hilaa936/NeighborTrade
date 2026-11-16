import { db } from "./db";
import { ApiError, forbidden, notFound } from "./errors";
import { listingActionSchema, listingSchema, searchSchema } from "./validation";
import { describeLocation, distanceKm } from "@/lib/geo";
import { normalizeSearch } from "@/lib/search";

const DAY_MS = 24 * 60 * 60 * 1000;
const PAGE_SIZE = 60;

const ownerSelect = { select: { id: true, name: true, image: true } };

export const expiryDate = (expiry, from = new Date()) =>
  expiry === "always" ? null : new Date(from.getTime() + Number(expiry) * DAY_MS);

// A listing other users can find and ask for
export const isAvailable = (listing, now = new Date()) =>
  listing.status === "ACTIVE" &&
  listing.quantity > 0 &&
  (!listing.expiresAt || listing.expiresAt > now);

// The shape sent to clients: coordinates are replaced by a viewer-relative description
export function serializeListing(listing, viewer) {
  const { lat, lng, localityId, ownerId, searchText, ...rest } = listing;
  return {
    ...rest,
    ownerId,
    isMine: viewer?.id === ownerId,
    isAvailable: isAvailable(listing),
    location: describeLocation(viewer, { lat, lng, localityId }),
  };
}

async function ownerLocation(userId) {
  const owner = await db.user.findUnique({
    where: { id: userId },
    select: { localityId: true, lat: true, lng: true },
  });
  if (owner?.lat == null) throw new ApiError(400, "location_required");
  return owner;
}

function listingData(input) {
  const { expiry, ...fields } = listingSchema.parse(input);
  const data = {
    ...fields,
    customCategory: fields.category === "other" ? fields.customCategory : null,
    wanted: fields.isExchange ? fields.wanted : null,
  };
  const searchText = normalizeSearch(
    [data.title, data.description, data.customCategory, data.wanted].filter(Boolean).join(" ")
  );
  return { ...data, searchText, expiry };
}

export async function createListing(user, input) {
  const { expiry, ...data } = listingData(input);
  const location = await ownerLocation(user.id);
  return db.listing.create({
    data: { ...data, ...location, ownerId: user.id, expiresAt: expiryDate(expiry) },
  });
}

// Loads a listing the user owns, or fails
async function getOwnListing(user, id) {
  const listing = await db.listing.findUnique({ where: { id } });
  if (!listing || listing.status === "DELETED") throw notFound();
  if (listing.ownerId !== user.id) throw forbidden();
  return listing;
}

export async function updateListing(user, id, input) {
  await getOwnListing(user, id);
  const { expiry, ...data } = listingData(input);
  const location = await ownerLocation(user.id);
  return db.listing.update({
    where: { id },
    data: { ...data, ...location, expiresAt: expiryDate(expiry) },
  });
}

export async function applyListingAction(user, id, input) {
  const listing = await getOwnListing(user, id);
  const { action, expiry } = listingActionSchema.parse(input);
  const data =
    action === "pause"
      ? { status: "PAUSED" }
      : action === "resume"
        ? { status: "ACTIVE" }
        : { status: "ACTIVE", expiresAt: expiryDate(expiry ?? (listing.expiresAt ? "14" : "always")) };
  return db.listing.update({ where: { id }, data });
}

// Soft delete so existing chats and trades keep their history
export async function deleteListing(user, id) {
  await getOwnListing(user, id);
  await db.listing.update({ where: { id }, data: { status: "DELETED" } });
}

export async function getListing(id, viewer) {
  const listing = await db.listing.findUnique({ where: { id }, include: { owner: ownerSelect } });
  if (!listing || listing.status === "DELETED") throw notFound();
  // Paused or expired listings stay visible only to their owner
  if (!isAvailable(listing) && listing.ownerId !== viewer?.id) throw notFound();
  return serializeListing(listing, viewer);
}

export async function getMyListings(user) {
  const listings = await db.listing.findMany({
    where: { ownerId: user.id, status: { not: "DELETED" } },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { conversations: true } } },
  });
  return listings.map((l) => serializeListing(l, user));
}

export async function getUserListings(ownerId, viewer) {
  const now = new Date();
  const listings = await db.listing.findMany({
    where: { ownerId, status: "ACTIVE", quantity: { gt: 0 }, OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] },
    orderBy: { createdAt: "desc" },
    include: { owner: ownerSelect },
  });
  return listings.map((l) => serializeListing(l, viewer));
}

export async function searchListings(params, viewer) {
  const { q, category, offer, maxKm } = searchSchema.parse(params);
  const now = new Date();
  const where = {
    status: "ACTIVE",
    quantity: { gt: 0 },
    AND: [{ OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] }],
  };
  if (viewer) where.ownerId = { not: viewer.id };
  if (category) where.category = category;
  if (offer === "free") where.isFree = true;
  if (offer === "exchange") where.isExchange = true;
  if (offer === "offers") where.openToOffers = true;
  // Every word must appear somewhere in the listing text
  for (const word of normalizeSearch(q ?? "").split(" ").filter(Boolean)) {
    where.AND.push({ searchText: { contains: word } });
  }

  const hasViewerLocation = viewer?.lat != null;
  if (maxKm && hasViewerLocation) {
    // Bounding box in SQL, exact distance below
    const dLat = maxKm / 111;
    const dLng = maxKm / (111 * Math.cos((viewer.lat * Math.PI) / 180));
    where.lat = { gte: viewer.lat - dLat, lte: viewer.lat + dLat };
    where.lng = { gte: viewer.lng - dLng, lte: viewer.lng + dLng };
  }

  let listings = await db.listing.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: PAGE_SIZE,
    include: { owner: ownerSelect },
  });
  if (maxKm && hasViewerLocation) {
    listings = listings.filter((l) => l.lat != null && distanceKm(viewer, l) <= maxKm);
  }
  return listings.map((l) => serializeListing(l, viewer));
}
