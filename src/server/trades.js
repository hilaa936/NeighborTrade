import { db } from "./db";
import { ApiError, forbidden, notFound } from "./errors";
import { addMessage, getOwnConversation } from "./chat";
import { isAvailable } from "./listings";
import { tradeActionSchema, tradeProposalSchema } from "./validation";

const conflict = (code) => new ApiError(409, code);

// Either side of a chat can propose a summary: how much, and what was agreed
export async function proposeTrade(user, conversationId, input) {
  const conversation = await getOwnConversation(user, conversationId);
  const { quantity, terms } = tradeProposalSchema.parse(input);
  const listing = await db.listing.findUnique({ where: { id: conversation.listingId } });
  if (!isAvailable(listing)) throw conflict("listing_unavailable");
  if (quantity > listing.quantity) throw conflict("not_enough_quantity");

  return db.$transaction(async (tx) => {
    const pending = await tx.trade.findFirst({ where: { conversationId, status: "PROPOSED" } });
    if (pending) throw conflict("trade_pending");
    const trade = await tx.trade.create({
      data: { conversationId, listingId: listing.id, proposerId: user.id, quantity, terms },
    });
    await addMessage(tx, conversation, user.id, { kind: "TRADE", tradeId: trade.id, tradeStatus: "PROPOSED" });
    return trade;
  });
}

// Who may move a trade from which status to which
const TRANSITIONS = {
  accept: { from: "PROPOSED", to: "ACCEPTED", who: "responder" },
  decline: { from: "PROPOSED", to: "DECLINED", who: "responder" },
  withdraw: { from: "PROPOSED", to: "WITHDRAWN", who: "proposer" },
  complete: { from: "ACCEPTED", to: "COMPLETED", who: "either" },
  cancel: { from: "ACCEPTED", to: "CANCELLED", who: "either" },
};

export async function actOnTrade(user, tradeId, input) {
  const { action } = tradeActionSchema.parse(input);
  const trade = await db.trade.findUnique({ where: { id: tradeId } });
  if (!trade) throw notFound();
  const conversation = await getOwnConversation(user, trade.conversationId);

  const rule = TRANSITIONS[action];
  const isProposer = trade.proposerId === user.id;
  if (rule.who === "responder" && isProposer) throw forbidden();
  if (rule.who === "proposer" && !isProposer) throw forbidden();

  return db.$transaction(async (tx) => {
    // Conditional update so two clicks at once cannot both succeed
    const moved = await tx.trade.updateMany({
      where: { id: tradeId, status: rule.from },
      data: { status: rule.to },
    });
    if (moved.count === 0) throw conflict("trade_state_changed");

    if (action === "accept") {
      const now = new Date();
      const taken = await tx.listing.updateMany({
        where: {
          id: trade.listingId,
          status: "ACTIVE",
          quantity: { gte: trade.quantity },
          OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
        },
        data: { quantity: { decrement: trade.quantity } },
      });
      if (taken.count === 0) throw conflict("not_enough_quantity");
      // Clear floating point leftovers (e.g. 0.3 - 0.1 - 0.2)
      await tx.listing.updateMany({
        where: { id: trade.listingId, quantity: { lt: 0.001 } },
        data: { quantity: 0 },
      });
    }
    if (action === "cancel") {
      await tx.listing.update({
        where: { id: trade.listingId },
        data: { quantity: { increment: trade.quantity } },
      });
    }

    await addMessage(tx, conversation, user.id, { kind: "TRADE", tradeId, tradeStatus: rule.to });
    return tx.trade.findUnique({ where: { id: tradeId } });
  });
}

export async function listMyTrades(user) {
  const trades = await db.trade.findMany({
    where: { conversation: { OR: [{ buyerId: user.id }, { sellerId: user.id }] } },
    orderBy: { updatedAt: "desc" },
    include: {
      listing: { select: { id: true, title: true, images: true, unit: true, category: true } },
      conversation: {
        select: {
          id: true,
          buyerId: true,
          buyer: { select: { id: true, name: true, image: true } },
          seller: { select: { id: true, name: true, image: true } },
        },
      },
    },
  });
  return trades.map(({ conversation, ...trade }) => {
    const isBuyer = conversation.buyerId === user.id;
    return {
      ...trade,
      conversationId: conversation.id,
      role: isBuyer ? "buyer" : "seller",
      other: isBuyer ? conversation.seller : conversation.buyer,
    };
  });
}
