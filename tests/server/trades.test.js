import { beforeEach, describe, expect, it } from "vitest";
import { db } from "@/server/db";
import { startConversation } from "@/server/chat";
import { createListing } from "@/server/listings";
import { actOnTrade, listMyTrades, proposeTrade } from "@/server/trades";
import { listingInput, makeUser, resetDb } from "./helpers";

beforeEach(resetDb);

async function setup(quantity = 3) {
  const seller = await makeUser();
  const buyer = await makeUser();
  const stranger = await makeUser();
  const listing = await createListing(seller, listingInput({ quantity }));
  const chat = await startConversation(buyer, listing.id);
  return { seller, buyer, stranger, listing, chat };
}

const quantityOf = async (id) => (await db.listing.findUnique({ where: { id } })).quantity;

describe("trades", () => {
  it("accepting takes the quantity, cancelling returns it", async () => {
    const { seller, buyer, listing, chat } = await setup();
    const trade = await proposeTrade(buyer, chat.id, { quantity: 1, terms: "בחינם" });
    await actOnTrade(seller, trade.id, { action: "accept" });
    expect(await quantityOf(listing.id)).toBe(2);
    await actOnTrade(buyer, trade.id, { action: "cancel" });
    expect(await quantityOf(listing.id)).toBe(3);
  });

  it("the proposer cannot accept their own proposal, a stranger cannot act", async () => {
    const { buyer, stranger, chat } = await setup();
    const trade = await proposeTrade(buyer, chat.id, { quantity: 1, terms: "צנצנת דבש" });
    await expect(actOnTrade(buyer, trade.id, { action: "accept" })).rejects.toMatchObject({ code: "forbidden" });
    await expect(actOnTrade(stranger, trade.id, { action: "decline" })).rejects.toMatchObject({
      code: "forbidden",
    });
  });

  it("allows one open proposal at a time and only valid transitions", async () => {
    const { seller, buyer, chat } = await setup();
    const trade = await proposeTrade(buyer, chat.id, { quantity: 1, terms: "בחינם" });
    await expect(proposeTrade(seller, chat.id, { quantity: 2, terms: "בחינם" })).rejects.toMatchObject({
      code: "trade_pending",
    });
    await expect(actOnTrade(seller, trade.id, { action: "complete" })).rejects.toMatchObject({
      code: "trade_state_changed",
    });
    await actOnTrade(buyer, trade.id, { action: "withdraw" });
    await proposeTrade(seller, chat.id, { quantity: 2, terms: "בחינם" });
  });

  it("cannot take more than what is left", async () => {
    const { seller, buyer, stranger, listing, chat } = await setup(2);
    await expect(proposeTrade(buyer, chat.id, { quantity: 5, terms: "בחינם" })).rejects.toMatchObject({
      code: "not_enough_quantity",
    });
    const trade = await proposeTrade(buyer, chat.id, { quantity: 2, terms: "בחינם" });
    // Someone else takes the produce before the seller accepts
    const otherChat = await startConversation(stranger, listing.id);
    const otherTrade = await proposeTrade(stranger, otherChat.id, { quantity: 1.5, terms: "בחינם" });
    await actOnTrade(seller, otherTrade.id, { action: "accept" });
    await expect(actOnTrade(seller, trade.id, { action: "accept" })).rejects.toMatchObject({
      code: "not_enough_quantity",
    });
    expect((await db.trade.findUnique({ where: { id: trade.id } })).status).toBe("PROPOSED");
  });

  it("writes a chat message for each step and lists trades for both sides", async () => {
    const { seller, buyer, chat } = await setup();
    const trade = await proposeTrade(buyer, chat.id, { quantity: 1, terms: "בחינם" });
    await actOnTrade(seller, trade.id, { action: "accept" });
    await actOnTrade(seller, trade.id, { action: "complete" });
    const messages = await db.message.findMany({ where: { conversationId: chat.id }, orderBy: { createdAt: "asc" } });
    expect(messages.map((m) => m.tradeStatus)).toEqual(["PROPOSED", "ACCEPTED", "COMPLETED"]);
    expect((await listMyTrades(buyer))[0]).toMatchObject({ role: "buyer", status: "COMPLETED" });
    expect((await listMyTrades(seller))[0]).toMatchObject({ role: "seller", other: { id: buyer.id } });
  });
});
