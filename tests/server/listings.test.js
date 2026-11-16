import { beforeEach, describe, expect, it } from "vitest";
import { db } from "@/server/db";
import {
  applyListingAction,
  createListing,
  deleteListing,
  getListing,
  searchListings,
  updateListing,
} from "@/server/listings";
import { listingInput, makeUser, resetDb } from "./helpers";

beforeEach(resetDb);

describe("permissions", () => {
  it("requires a location before posting", async () => {
    const user = await makeUser({ localityId: null });
    await expect(createListing(user, listingInput())).rejects.toMatchObject({ code: "location_required" });
  });

  it("only the owner can edit or delete", async () => {
    const owner = await makeUser();
    const other = await makeUser();
    const listing = await createListing(owner, listingInput());
    await expect(updateListing(other, listing.id, listingInput({ title: "גנבתי" }))).rejects.toMatchObject({
      code: "forbidden",
    });
    await expect(deleteListing(other, listing.id)).rejects.toMatchObject({ code: "forbidden" });
    await expect(applyListingAction(other, listing.id, { action: "pause" })).rejects.toMatchObject({
      code: "forbidden",
    });
  });

  it("ignores fields the client must not set", async () => {
    const owner = await makeUser();
    const other = await makeUser();
    const listing = await createListing(owner, listingInput({ ownerId: other.id, status: "DELETED" }));
    expect(listing.ownerId).toBe(owner.id);
    expect(listing.status).toBe("ACTIVE");
  });

  it("requires at least one offer type and a name for a custom category", async () => {
    const owner = await makeUser();
    await expect(createListing(owner, listingInput({ isFree: false }))).rejects.toThrow();
    await expect(createListing(owner, listingInput({ category: "other" }))).rejects.toThrow();
    const custom = await createListing(owner, listingInput({ category: "other", customCategory: "ביצים" }));
    expect(custom.customCategory).toBe("ביצים");
  });
});

describe("visibility and location", () => {
  it("hides coordinates and describes the location relative to the viewer", async () => {
    const owner = await makeUser({ localityId: "tel-aviv" });
    const neighbor = await makeUser({ localityId: "tel-aviv" });
    const far = await makeUser({ localityId: "haifa" });
    const listing = await createListing(owner, listingInput());

    const seenByNeighbor = await getListing(listing.id, neighbor);
    expect(seenByNeighbor).not.toHaveProperty("lat");
    expect(seenByNeighbor.location).toEqual({ kind: "sameCity" });

    const seenFromHaifa = await getListing(listing.id, far);
    expect(seenFromHaifa.location.kind).toBe("distance");
    expect(seenFromHaifa.location.km).toBeGreaterThan(70);

    const seenByGuest = await getListing(listing.id, null);
    expect(seenByGuest.location).toEqual({ kind: "city", localityId: "tel-aviv" });
  });

  it("search skips paused, expired, empty and own listings", async () => {
    const owner = await makeUser();
    const viewer = await makeUser();
    const visible = await createListing(owner, listingInput({ title: "גלוי" }));
    const paused = await createListing(owner, listingInput({ title: "מושהה" }));
    await applyListingAction(owner, paused.id, { action: "pause" });
    const expired = await createListing(owner, listingInput({ title: "פג" }));
    await db.listing.update({ where: { id: expired.id }, data: { expiresAt: new Date(Date.now() - 1000) } });
    const empty = await createListing(owner, listingInput({ title: "נגמר" }));
    await db.listing.update({ where: { id: empty.id }, data: { quantity: 0 } });
    await createListing(viewer, listingInput({ title: "שלי" }));

    const results = await searchListings({}, viewer);
    expect(results.map((l) => l.id)).toEqual([visible.id]);
    await expect(getListing(paused.id, viewer)).rejects.toMatchObject({ code: "not_found" });
    expect((await getListing(paused.id, owner)).isAvailable).toBe(false);
  });

  it("'always available' listings never expire", async () => {
    const owner = await makeUser();
    const listing = await createListing(owner, listingInput({ expiry: "always" }));
    expect(listing.expiresAt).toBeNull();
  });

  it("filters by distance, text and offer type", async () => {
    const telAviv = await makeUser({ localityId: "tel-aviv" });
    const haifa = await makeUser({ localityId: "haifa" });
    const viewer = await makeUser({ localityId: "ramat-gan" });
    const near = await createListing(telAviv, listingInput({ title: "נענע", category: "herbs" }));
    await createListing(haifa, listingInput({ title: "לימונים", isFree: false, isExchange: true, wanted: "דבש" }));

    expect((await searchListings({ maxKm: "10" }, viewer)).map((l) => l.id)).toEqual([near.id]);
    expect(await searchListings({ q: "לימון" }, viewer)).toHaveLength(1);
    expect(await searchListings({ q: "דבש" }, viewer)).toHaveLength(1);
    expect(await searchListings({ offer: "exchange" }, viewer)).toHaveLength(1);
    expect(await searchListings({ category: "herbs" }, viewer)).toHaveLength(1);
  });
});
