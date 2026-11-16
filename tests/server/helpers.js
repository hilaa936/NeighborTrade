import { db } from "@/server/db";
import { resolveLocation } from "@/lib/geo";

export async function resetDb() {
  await db.$executeRawUnsafe("TRUNCATE users, listings, conversations, messages, trades CASCADE");
}

let counter = 0;

export async function makeUser({ localityId = "tel-aviv", ...data } = {}) {
  counter += 1;
  return db.user.create({
    data: {
      email: `user${counter}@test.local`,
      name: `User ${counter}`,
      ...(localityId ? resolveLocation({ localityId }) : {}),
      ...data,
    },
  });
}

export const listingInput = (overrides = {}) => ({
  title: "עגבניות שרי",
  description: "מהגינה",
  category: "vegetables",
  quantity: 3,
  unit: "KG",
  isFree: true,
  isExchange: false,
  openToOffers: false,
  images: [],
  expiry: "7",
  ...overrides,
});
