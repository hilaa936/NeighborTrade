import { beforeEach, describe, expect, it } from "vitest";
import {
  getConversationDetails,
  getMessages,
  listConversations,
  markRead,
  sendMessage,
  startConversation,
  unreadCount,
} from "@/server/chat";
import { createListing } from "@/server/listings";
import { listingInput, makeUser, resetDb } from "./helpers";

beforeEach(resetDb);

async function setup() {
  const seller = await makeUser();
  const buyer = await makeUser();
  const stranger = await makeUser();
  const listing = await createListing(seller, listingInput());
  return { seller, buyer, stranger, listing };
}

describe("chat", () => {
  it("opens one chat per buyer and listing, never on your own listing", async () => {
    const { seller, buyer, listing } = await setup();
    const first = await startConversation(buyer, listing.id);
    const again = await startConversation(buyer, listing.id);
    expect(again.id).toBe(first.id);
    await expect(startConversation(seller, listing.id)).rejects.toMatchObject({ code: "own_listing" });
  });

  it("only participants can read or write", async () => {
    const { buyer, stranger, listing } = await setup();
    const chat = await startConversation(buyer, listing.id);
    await expect(getMessages(stranger, chat.id)).rejects.toMatchObject({ code: "forbidden" });
    await expect(sendMessage(stranger, chat.id, { body: "היי" })).rejects.toMatchObject({ code: "forbidden" });
    await expect(getConversationDetails(stranger, chat.id)).rejects.toMatchObject({ code: "forbidden" });
  });

  it("the seller sees the chat only after the first message, with unread counts", async () => {
    const { seller, buyer, listing } = await setup();
    const chat = await startConversation(buyer, listing.id);
    expect(await listConversations(seller)).toHaveLength(0);

    await sendMessage(buyer, chat.id, { body: "אפשר לקבל חצי קילו?" });
    await sendMessage(buyer, chat.id, { body: "תודה!" });
    const [row] = await listConversations(seller);
    expect(row).toMatchObject({ unread: 2, role: "seller", other: { id: buyer.id } });
    expect(await unreadCount(seller)).toBe(2);
    expect(await unreadCount(buyer)).toBe(0);

    await markRead(seller, chat.id);
    expect(await unreadCount(seller)).toBe(0);
  });

  it("returns only newer messages when polling", async () => {
    const { buyer, listing } = await setup();
    const chat = await startConversation(buyer, listing.id);
    const first = await sendMessage(buyer, chat.id, { body: "1" });
    await sendMessage(buyer, chat.id, { body: "2" });
    const newer = await getMessages(buyer, chat.id, { after: first.createdAt.toISOString() });
    expect(newer.map((m) => m.body)).toEqual(["2"]);
  });

  it("chat details expose no email or coordinates of the other person", async () => {
    const { buyer, listing } = await setup();
    const chat = await startConversation(buyer, listing.id);
    const details = await getConversationDetails(buyer, chat.id);
    expect(details.other).not.toHaveProperty("email");
    expect(details.other).not.toHaveProperty("lat");
    expect(details.listing).not.toHaveProperty("lat");
  });
});
