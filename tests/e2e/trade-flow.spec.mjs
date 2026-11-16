import { expect, test } from "@playwright/test";

const unique = () => `${Date.now()}${Math.floor(Math.random() * 1000)}`;

// Registers, picks a locality and lands back on `next`
async function signUp(page, name, locality) {
  await page.goto("/auth/register");
  await page.getByLabel("שם (כפי שיוצג לשכנים)").fill(name);
  await page.getByLabel("אימייל").fill(`user-${unique()}@test.local`);
  await page.getByLabel("סיסמה").fill("password123");
  await page.getByRole("button", { name: "יצירת חשבון" }).click();
  await page.waitForURL(/\/profile/);
  await page.getByLabel("יישוב").selectOption(locality);
  await page.getByRole("button", { name: "שמירה" }).click();
  await page.waitForURL(/\/market/);
}

test("a neighbor asks for produce in the chat and both sides close the trade", async ({ browser }) => {
  const sellerContext = await browser.newContext();
  const buyerContext = await browser.newContext();
  const seller = await sellerContext.newPage();
  const buyer = await buyerContext.newPage();
  const title = `עגבניות ${unique()}`;

  // Seller publishes a listing
  await signUp(seller, "מוכרת", "tel-aviv");
  await seller.goto("/listings/new");
  await seller.getByLabel("מה יש לך?").fill(title);
  await seller.getByLabel("כמות").fill("3");
  await seller.getByRole("button", { name: "פרסום" }).click();
  await seller.waitForURL(/\/listings\/(?!new$)[^/]+$/);
  const listingUrl = seller.url();
  await expect(seller.getByText("זו המודעה שלך")).toBeVisible();

  // Buyer from a nearby city finds it, sees distance (not an address) and writes
  await signUp(buyer, "קונה", "ramat-gan");
  await buyer.goto(`/market?q=${encodeURIComponent(title)}`);
  await buyer.getByRole("link", { name: new RegExp(title) }).click();
  await expect(buyer.getByText(/ק״מ ממך/)).toBeVisible();
  await buyer.getByRole("button", { name: "שליחת הודעה" }).click();
  await buyer.waitForURL(/\/messages\/.+/);
  await buyer.getByLabel("כתיבת הודעה...").fill("היי, אפשר קילו?");
  await buyer.getByRole("button", { name: "שליחה" }).click();
  await expect(buyer.getByText("היי, אפשר קילו?")).toBeVisible();

  // Buyer proposes a summary
  await buyer.getByTitle("סגירת מה שסוכם").click();
  await buyer.getByLabel(/כמות/).fill("1");
  await buyer.getByRole("button", { name: "שליחת הסיכום" }).click();
  await expect(buyer.getByText("ממתין לאישור").first()).toBeVisible();

  // Seller sees the chat, accepts, and the quantity goes down
  await seller.goto("/messages");
  await seller.getByRole("link", { name: /קונה/ }).click();
  await expect(seller.getByText("היי, אפשר קילו?")).toBeVisible();
  await seller.getByRole("button", { name: "אישור" }).click();
  await expect(seller.getByText("סוכם, ממתין למסירה").first()).toBeVisible();
  await seller.goto(listingUrl);
  await expect(seller.getByText("2 ק״ג").first()).toBeVisible();

  // Buyer marks it handed over; the trade shows on both sides
  await expect(buyer.getByText("סוכם, ממתין למסירה").first()).toBeVisible({ timeout: 10_000 });
  await buyer.getByRole("button", { name: "נמסר ✓" }).click();
  await expect(buyer.getByText("סימן/ה שנמסר")).toBeVisible();
  await seller.goto("/trades");
  await expect(seller.getByText("נמסר", { exact: true })).toBeVisible();

  await sellerContext.close();
  await buyerContext.close();
});

test("protected pages send guests to login, and a wrong password is rejected", async ({ page }) => {
  await page.goto("/messages");
  await expect(page).toHaveURL(/\/auth\/login\?callbackUrl=%2Fmessages/);
  await page.getByLabel("אימייל").fill("nobody@test.local");
  await page.getByLabel("סיסמה").fill("wrong-password");
  await page.getByRole("button", { name: "התחברות" }).click();
  await expect(page.getByText("אימייל או סיסמה שגויים")).toBeVisible();
});
