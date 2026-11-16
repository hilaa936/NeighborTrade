// Demo data for local development: `npm run db:seed` (wipes the database first)
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const DAY = 24 * 60 * 60 * 1000;
const DEMO_PASSWORD = "password123";

// Same centers as src/lib/localities.js
const PLACES = {
  "tel-aviv": [32.0853, 34.7818],
  "ramat-gan": [32.0823, 34.8106],
  givatayim: [32.0722, 34.8125],
  haifa: [32.794, 34.9896],
  jerusalem: [31.7683, 35.2137],
  modiin: [31.898, 35.0104],
};

const normalize = (text) =>
  text
    .toLowerCase()
    .replace(/[ךםןףץ]/g, (c) => ({ ך: "כ", ם: "מ", ן: "נ", ף: "פ", ץ: "צ" })[c])
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

const users = [
  { key: "dana", name: "דנה", email: "dana@example.com", place: "tel-aviv", bio: "מגדלת ירקות במרפסת בפלורנטין. אוהבת להחליף שתילים." },
  { key: "yossi", name: "יוסי", email: "yossi@example.com", place: "ramat-gan", bio: "גינה קטנה ליד הבית, הרבה לימונים." },
  { key: "maya", name: "מאיה", email: "maya@example.com", place: "givatayim", bio: "עשבי תיבול ותבלינים, תמיד שמחה לתת." },
  { key: "ahmad", name: "אחמד", email: "ahmad@example.com", place: "haifa", bio: "עצי זית ותאנה בחצר." },
  { key: "rivka", name: "רבקה", email: "rivka@example.com", place: "jerusalem", bio: "גינה קהילתית בשכונה." },
  { key: "omer", name: "עומר", email: "omer@example.com", place: "modiin", bio: "מגדל עגבניות ופלפלים, מחפש זרעים מעניינים." },
];

const listings = [
  { owner: "dana", title: "עגבניות שרי", description: "מגוון צבעים, נקטפו הבוקר.", category: "vegetables", quantity: 2, unit: "KG", isFree: true, days: 3 },
  { owner: "dana", title: "שתילי בזיליקום", description: "שתילים חזקים בעציצים קטנים.", category: "plants", quantity: 6, unit: "POT", isExchange: true, wanted: "שתילי פלפל חריף", days: null },
  { owner: "yossi", title: "לימונים", description: "לימונים עסיסיים מהעץ בחצר.", category: "fruits", quantity: 10, unit: "KG", isFree: true, openToOffers: true, days: 14 },
  { owner: "yossi", title: "נענע טרייה", category: "herbs", quantity: 5, unit: "BUNCH", isFree: true, days: 7 },
  { owner: "maya", title: "רוזמרין", description: "צרורות גדולים, מתאים לייבוש.", category: "herbs", quantity: 8, unit: "BUNCH", isFree: true, isExchange: true, wanted: "ביצים טריות", days: 14 },
  { owner: "maya", title: "זרעי עגבנייה מורשת", description: "זרעים שנאספו מהיבול של השנה.", category: "seeds", quantity: 20, unit: "BAG", isExchange: true, wanted: "כל זרע מעניין", openToOffers: true, days: null },
  { owner: "ahmad", title: "שמן זית ביתי", description: "מסיק השנה, בקבוקים של חצי ליטר.", category: "other", customCategory: "שמן זית", quantity: 4, unit: "UNIT", isExchange: true, openToOffers: true, wanted: "דבש", days: 30 },
  { owner: "ahmad", title: "תאנים", category: "fruits", quantity: 3, unit: "KG", isFree: true, days: 3 },
  { owner: "rivka", title: "חסה ערבית", description: "מהגינה הקהילתית, בלי ריסוסים.", category: "vegetables", quantity: 12, unit: "UNIT", isFree: true, days: 7 },
  { owner: "rivka", title: "ייחורי גרניום", category: "plants", quantity: 10, unit: "UNIT", isFree: true, days: null },
  { owner: "omer", title: "פלפל חריף", description: "חריף מאוד! בשקיות קטנות.", category: "vegetables", quantity: 6, unit: "BAG", isFree: true, isExchange: true, wanted: "שתילי בזיליקום", days: 14 },
  { owner: "omer", title: "דלעת ערמונים", category: "vegetables", quantity: 4, unit: "UNIT", openToOffers: true, days: 30 },
];

async function main() {
  if (process.env.NODE_ENV === "production") throw new Error("Refusing to seed (and wipe) a production database");
  await db.$executeRawUnsafe("TRUNCATE users, listings, conversations, messages, trades CASCADE");

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const userIds = {};
  for (const { key, place, ...data } of users) {
    const [lat, lng] = PLACES[place];
    const user = await db.user.create({ data: { ...data, passwordHash, localityId: place, lat, lng } });
    userIds[key] = user.id;
  }

  const listingIds = [];
  for (const [index, { owner, days, ...data }] of listings.entries()) {
    const ownerData = users.find((u) => u.key === owner);
    const [lat, lng] = PLACES[ownerData.place];
    const createdAt = new Date(Date.now() - index * 3 * 60 * 60 * 1000);
    const listing = await db.listing.create({
      data: {
        isFree: false,
        isExchange: false,
        openToOffers: false,
        ...data,
        ownerId: userIds[owner],
        localityId: ownerData.place,
        lat,
        lng,
        searchText: normalize([data.title, data.description, data.customCategory, data.wanted].filter(Boolean).join(" ")),
        createdAt,
        expiresAt: days ? new Date(createdAt.getTime() + days * DAY) : null,
      },
    });
    listingIds.push(listing.id);
  }

  // One chat with an agreed trade, so the messages screen is not empty
  const lemons = listingIds[2];
  const chat = await db.conversation.create({
    data: { listingId: lemons, buyerId: userIds.dana, sellerId: userIds.yossi },
  });
  const at = (minutesAgo) => new Date(Date.now() - minutesAgo * 60 * 1000);
  const say = (sender, body, minutesAgo) =>
    db.message.create({ data: { conversationId: chat.id, senderId: userIds[sender], body, createdAt: at(minutesAgo) } });
  await say("dana", "היי! אשמח לקילו לימונים אם אפשר 🍋", 90);
  await say("yossi", "בטח, אפשר גם שניים. מתי נוח לך לאסוף?", 80);
  await say("dana", "מחר אחה״צ? אביא לך שתיל בזיליקום בתמורה", 70);
  const trade = await db.trade.create({
    data: { conversationId: chat.id, listingId: lemons, proposerId: userIds.dana, quantity: 2, terms: "שתיל בזיליקום", createdAt: at(60) },
  });
  await db.message.create({
    data: { conversationId: chat.id, senderId: userIds.dana, kind: "TRADE", tradeId: trade.id, tradeStatus: "PROPOSED", createdAt: at(60) },
  });
  await db.conversation.update({ where: { id: chat.id }, data: { lastMessageAt: at(60), buyerReadAt: at(60), sellerReadAt: at(85) } });

  console.log(`Seeded ${users.length} users and ${listings.length} listings. Password for all: ${DEMO_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
