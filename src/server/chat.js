import { Prisma } from "@prisma/client";
import { db } from "./db";
import { ApiError, forbidden, notFound } from "./errors";
import { isAvailable, serializeListing } from "./listings";
import { messageSchema } from "./validation";
import { describeLocation } from "@/lib/geo";

const userSelect = { select: { id: true, name: true, image: true } };
const MESSAGE_PAGE = 200;

export const messageInclude = {
  trade: { select: { id: true, quantity: true, terms: true, status: true, proposerId: true } },
};

// Loads a conversation the user takes part in, or fails
export async function getOwnConversation(user, id) {
  const conversation = await db.conversation.findUnique({ where: { id } });
  if (!conversation) throw notFound();
  if (conversation.buyerId !== user.id && conversation.sellerId !== user.id) throw forbidden();
  return conversation;
}

const readField = (conversation, userId) =>
  conversation.buyerId === userId ? "buyerReadAt" : "sellerReadAt";

// Opens (or reuses) the chat between the user and the owner of a listing
export async function startConversation(user, listingId) {
  const listing = await db.listing.findUnique({ where: { id: listingId } });
  if (!listing || listing.status === "DELETED") throw notFound();
  if (listing.ownerId === user.id) throw new ApiError(400, "own_listing");
  const existing = await db.conversation.findUnique({
    where: { listingId_buyerId: { listingId, buyerId: user.id } },
  });
  if (existing) return existing;
  if (!isAvailable(listing)) throw new ApiError(400, "listing_unavailable");
  try {
    return await db.conversation.create({
      data: { listingId, buyerId: user.id, sellerId: listing.ownerId },
    });
  } catch (error) {
    // Two requests raced to open the same chat; use the one that won
    if (!isUniqueViolation(error)) throw error;
    return db.conversation.findUnique({ where: { listingId_buyerId: { listingId, buyerId: user.id } } });
  }
}

// Unread messages per conversation for the user
async function unreadByConversation(userId) {
  const rows = await db.$queryRaw`
    SELECT m."conversationId" AS id, COUNT(*)::int AS count
    FROM messages m JOIN conversations c ON c.id = m."conversationId"
    WHERE m."senderId" <> ${userId}
      AND ((c."buyerId" = ${userId} AND m."createdAt" > c."buyerReadAt")
        OR (c."sellerId" = ${userId} AND m."createdAt" > c."sellerReadAt"))
    GROUP BY m."conversationId"`;
  return new Map(rows.map((r) => [r.id, r.count]));
}

export async function unreadCount(user) {
  const counts = await unreadByConversation(user.id);
  let total = 0;
  for (const count of counts.values()) total += count;
  return total;
}

export async function listConversations(user) {
  const [conversations, unread] = await Promise.all([
    db.conversation.findMany({
      // The seller only sees a chat once the buyer has written something
      where: { OR: [{ buyerId: user.id }, { sellerId: user.id, messages: { some: {} } }] },
      orderBy: { lastMessageAt: "desc" },
      include: {
        listing: { select: { id: true, title: true, images: true, status: true, unit: true } },
        buyer: userSelect,
        seller: userSelect,
        messages: { orderBy: { createdAt: "desc" }, take: 1, include: messageInclude },
      },
    }),
    unreadByConversation(user.id),
  ]);
  return conversations.map((c) => ({
    id: c.id,
    listing: c.listing,
    other: c.buyerId === user.id ? c.seller : c.buyer,
    role: c.buyerId === user.id ? "buyer" : "seller",
    lastMessage: c.messages[0] ?? null,
    lastMessageAt: c.lastMessageAt,
    unread: unread.get(c.id) ?? 0,
  }));
}

// Everything the chat screen needs besides the messages
export async function getConversationDetails(user, id) {
  const conversation = await getOwnConversation(user, id);
  const isBuyer = conversation.buyerId === user.id;
  const [listing, other, trades] = await Promise.all([
    db.listing.findUnique({ where: { id: conversation.listingId }, include: { owner: userSelect } }),
    db.user.findUnique({
      where: { id: isBuyer ? conversation.sellerId : conversation.buyerId },
      select: { id: true, name: true, image: true, bio: true, localityId: true, lat: true, lng: true, createdAt: true },
    }),
    db.trade.findMany({ where: { conversationId: id }, orderBy: { createdAt: "desc" } }),
  ]);
  const { lat, lng, localityId, ...otherPublic } = other;
  return {
    id,
    role: isBuyer ? "buyer" : "seller",
    listing: { ...serializeListing(listing, user), isDeleted: listing.status === "DELETED" },
    other: { ...otherPublic, location: describeLocation(user, { lat, lng, localityId }) },
    trades,
  };
}

export async function getMessages(user, id, { after } = {}) {
  await getOwnConversation(user, id);
  const since = after ? new Date(after) : null;
  if (since && Number.isNaN(since.getTime())) throw new ApiError(400, "invalid_input");
  if (since) {
    return db.message.findMany({
      where: { conversationId: id, createdAt: { gt: since } },
      orderBy: { createdAt: "asc" },
      include: messageInclude,
    });
  }
  const latest = await db.message.findMany({
    where: { conversationId: id },
    orderBy: { createdAt: "desc" },
    take: MESSAGE_PAGE,
    include: messageInclude,
  });
  return latest.reverse();
}

// Adds a message and bumps the conversation, inside an optional transaction
export async function addMessage(tx, conversation, senderId, data) {
  const message = await tx.message.create({
    data: { conversationId: conversation.id, senderId, ...data },
    include: messageInclude,
  });
  await tx.conversation.update({
    where: { id: conversation.id },
    data: { lastMessageAt: message.createdAt, [readField(conversation, senderId)]: message.createdAt },
  });
  return message;
}

export async function sendMessage(user, id, input) {
  const conversation = await getOwnConversation(user, id);
  const { body } = messageSchema.parse(input);
  return db.$transaction((tx) => addMessage(tx, conversation, user.id, { body }));
}

export async function markRead(user, id) {
  const conversation = await getOwnConversation(user, id);
  await db.conversation.update({
    where: { id },
    data: { [readField(conversation, user.id)]: new Date() },
  });
}

export const isUniqueViolation = (error) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
