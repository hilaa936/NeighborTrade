# NeighborTrade – סקירת מצב ותוכנית עבודה

> תאריך הסקירה: 16/11/2026 · לא שונה קוד במהלך הסקירה.
> במהלך הבדיקה הרצתי את השרת מקומית ויצרתי משתמש ומודעת בדיקה ב-DB המקומי. שניהם נמחקו בסוף.

---

## 1. הבנת הפרויקט

### מה זה?
**NeighborTrade** היא פלטפורמת ווב קהילתית לאנשים שמגדלים ירקות, פירות וצמחים בבית. כל אחד יכול לפרסם את העודפים שלו, לגלוש במודעות של שכנים ולפנות למגדל כדי לקבל או להחליף תוצרת.

### למי?
מגדלים ביתיים ושכנים באזור מקומי שרוצים לקבל תוצרת טרייה, בחינם או בהחלפה.

### שפה וקהל
עברית + RTL, לשכנים בישראל (פירוט בסעיף 4).

### מודל הסחר (לפי ההחלטה שלך)
לכל מודעה יש **צ'אט בין המתעניין לבין המפרסם**. בצ'אט אפשר לבקש את התוצרת בחינם או להציע משהו בתמורה. אחרי שמגיעים להסכמה, "סוגרים" את מה שסוכם (העסקה מסומנת כמוסכמת והכמות מתעדכנת). **אין תשלומים.**

### Stack
| שכבה | טכנולוגיה |
|---|---|
| Frontend + Backend | Next.js 14.2.13 (App Router, API Routes), React 18, JavaScript (ללא TypeScript) |
| עיצוב | Tailwind CSS 3, Heroicons |
| אימות | NextAuth v4: אימייל/סיסמה (bcrypt) ו-Google OAuth, סשן JWT |
| מסד נתונים | PostgreSQL + Prisma 5, מפוצל ל-**3 מסדים נפרדים** (`accounts`, `trade`, `travel`) עם 3 Prisma Clients שנוצרים לתיקייה `src/prisma/generated/*` |
| HTTP בצד לקוח | axios / fetch |

### היסטוריה
- 26 קומיטים בין 1/10/2024 ל-5/11/2024, ב-`main`, עם remote ל-`github.com/hilaa936/NeighborTrade`.
- בהתחלה הפרויקט היה רק "שוק תוצרת". ב-31/10/2024 נוסף מודול **תכנון טיולים עם AI** (travel), ובהמשך הקוד פוצל ל-3 מסדי נתונים.
- **מודול הטיולים הועבר לפרויקט נפרד** (`~/projects/AITravelApp`), שהשתלט גם על ה-DB בשם `travel`. מה שנשאר כאן הוא עותק ישן שכבר לא תואם ל-DB.
- יש **שינויים שלא נכנסו לקומיט** (13 קבצים, רובם ב-travel). שניים מהם חשובים: `src/app/auth/register/page.js`, שבו השינוי שבר את ההרשמה (פירוט בסעיף 3), ו-`src/prisma/accounts/schema.prisma`.

### החלטה שכבר התקבלה
**מודול ה-travel יוסר מהפרויקט.** NeighborTrade יתמקד רק בסחר בתוצרת.

---

## 2. מה המצב עכשיו

### התקנה, בנייה והרצה
| שלב | תוצאה |
|---|---|
| `npm ci` | ✅ עבר (458 חבילות). ⚠️ **26 פגיעויות**: 4 קריטיות, 15 גבוהות |
| `prisma migrate status` (accounts, trade) | ✅ "Database schema is up to date" |
| `prisma migrate status` (travel) | ❌ ההיסטוריה המקומית וה-DB שונים לגמרי ("The last common migration is: null"), כי ה-DB שייך עכשיו ל-AITravelApp |
| `next lint` | ❌ 2 שגיאות ו-3 אזהרות |
| `next build` | ❌ **הבנייה נכשלת**. כל השגיאות מגיעות ממודול ה-travel (ראו בהמשך) |
| `next dev` | ✅ השרת עולה |
| טסטים | ❌ אין טסטים בכלל. אין סקריפט `test` ואין ספריית טסטים |

**שגיאות שמפילות את ה-build:**
```
./src/app/travel/(pages)/tripPreferences/page.js
37:37  Error: `'` can be escaped with `&apos;` ...  react/no-unescaped-entities

./src/app/travel/components/activities/Activities.js
20:5  Error: React Hook "useLocalStorageActivities" cannot be called inside a callback.  react-hooks/rules-of-hooks

./src/app/api/travel/ai-itinerary/route.js
Attempted import error: 'Configuration' is not exported from 'openai'
Attempted import error: 'OpenAIApi' is not exported from 'openai'
```
הסרת ה-travel לבדה תפתור את כל השגיאות האלה.

### בדיקת עשן (smoke test) מול השרת המקומי
| בדיקה | תוצאה |
|---|---|
| דפים `/`, `/auth/login`, `/auth/register`, `/profile`, `/tradingMarket/marketplace`, `/tradingMarket/produce` | 200 |
| `/tradingMarket/trades` | ❌ 500: `The default export is not a React Component` (הקובץ ריק) |
| לחיצה על "Start Trade" (מובילה ל-`/trade/1`) | ❌ 404, כי הנתיב האמיתי הוא `/tradingMarket/trade/1` |
| `POST /api/auth/register` | ✅ 201, אבל **התשובה מחזירה את ה-hash של הסיסמה** |
| **התחברות עם סיסמה שגויה** | ❌ **הצליחה!** נוצר סשן תקין (באג אבטחה קריטי) |
| `GET /api/profile` (משתמש מחובר) | ❌ 500: `PrismaClientValidationError` |
| `GET /api/produce?traderId=<מגדל אחר>` | ❌ 500: `No response is returned from route handler` |
| `PUT /api/produce/1` **בלי התחברות** | ❌ הבקשה הגיעה עד ה-DB, כלומר אין בדיקת הרשאה. החזירה הודעת שגיאה פנימית של Prisma |
| `POST /api/produce` (משתמש מחובר) | ✅ 201 |

### מצב הפיצ'רים (מודול הסחר והחשבון)

| פיצ'ר | מצב | הערות |
|---|---|---|
| הרשמה באימייל/סיסמה | 🟡 חלקי | ה-API עובד. דף ההרשמה **שבור** בגלל השינוי שלא נכנס לקומיט |
| התחברות באימייל/סיסמה | 🔴 שבור (אבטחה) | כל סיסמה מתקבלת |
| התחברות עם Google | 🟡 חלקי | יצירת המשתמש לא ממתינה (`await`) לסיום, עדכון "התחברות אחרונה" נכשל, ושם משתמש כפול נכשל בשקט |
| צפייה בפרופיל | 🔴 שבור | ה-API מחזיר 500 |
| עריכת פרופיל | 🔴 שבור | תלוי ב-API השבור. גם שמירה של תאריך לידה תיכשל |
| ניהול מודעות (הוספה/עריכה/מחיקה) | 🟡 עובד חלקית | הוספה עובדת. עריכה ומחיקה עובדות אבל **בלי הרשאות**. "Restore" לא משחזר. המחיקה נשלחת פעמיים. אין שדות יחידה, תמונה או מיקום |
| שוק (Marketplace) | 🟡 חלקי | רשימה וחיפוש לפי שם עובדים. הכרטיס מציג שדות שלא קיימים (`unit`, `produceStatus`), ולכן הסטטוס תמיד אדום וריק. לא מוצג מי המגדל ואיפה הוא |
| עמוד עסקה (`trade/[produceId]`) | 🔴 placeholder | רק כותרת עם ה-ID |
| רשימת העסקאות שלי (`trades`) | 🔴 קובץ ריק | |
| **צ'אט בין משתמשים** | ⚫ חסר לגמרי | הליבה של המוצר לפי ההחלטה |
| סגירת עסקה / "מה שסוכם" | ⚫ חסר | מודל `Trade` קיים רק בהערות |
| סינון לפי מיקום | ⚫ חסר | |
| התראות | ⚫ חסר | |
| נתונים מזויפים (mock) | ⚠️ | `marketplace/page.js:8-57` (לא בשימוש), `ProduceCard.js:6-21` (ערך ברירת מחדל), `lib/produce.js:2,18-28` (**בפיתוח, כשה-DB נכשל, מוחזר mock בשקט**, וזה מסתיר תקלות), `src/mock/mockData.json` |

---

## 3. מה צריך לתקן

### 🔴 קריטי: אבטחה

| # | מיקום | הבעיה | למה זה חשוב |
|---|---|---|---|
| S1 | `src/app/api/auth/[...nextauth]/route.js:25` | `verifyUserPassword(...)` נקראת **בלי `await`**, והתוצאה לא נבדקת | **כל אחד יכול להתחבר לכל חשבון עם כל סיסמה.** אומת בבדיקה. השגיאה שנזרקת מופיעה בלוג כ-`unhandledRejection: Error: Invalid password` |
| S2 | `src/app/api/produce/[id]/route.js:22-44` | ב-PUT וב-DELETE אין בדיקת סשן ואין בדיקה שהמודעה שייכת למשתמש | כל אחד, גם בלי חשבון, יכול לערוך או למחוק כל מודעה |
| S3 | `src/app/api/produce/[id]/route.js:25-27`, `src/lib/produce.js:59-65` | ה-body נשלח כמו שהוא ל-`prisma.update` (mass assignment) | אפשר לשנות `traderId`, כלומר "לגנוב" מודעה, או כל שדה אחר |
| S4 | `src/app/api/auth/register/route.js:33-35`, `src/app/api/users/route.js:35` | התשובה מחזירה את כל אובייקט המשתמש, **כולל hash הסיסמה** | דליפת מידע רגיש |
| S5 | `src/lib/user.js:106-135`, `src/app/api/profile/route.js:74,79` | הפרופיל נשמר מה-body בלי סינון שדות | אפשר להזריק `userId` ושדות אחרים |
| S6 | `src/app/profile/page.js:101-103` | `href={profile.website}` בלי ולידציה | URL מסוג `javascript:` יאפשר XSS מול מי שצופה בפרופיל |
| S7 | `src/app/api/produce/[id]/route.js:17,30,42`, `src/app/api/produce/route.js:38,62` | מוחזר `error.message` גולמי ללקוח | חושף מבנה DB והודעות Prisma פנימיות (אומת) |
| S8 | `src/app/api/users/route.js` | endpoint הרשמה כפול, בלי הגבלה. מדפיס את הבקשה ללוג (שורה 26). שולח `name` במקום `username` (שורה 29), ולכן תמיד נכשל | קוד מת שמגדיל את שטח התקיפה. למחוק |
| S9 | כללי | אין ולידציה לקלט (אורך, פורמט, סוג), אין מינימום לסיסמה, אין rate-limit על התחברות והרשמה, אין אימות אימייל | brute-force, ספאם ונתונים לא תקינים |
| S10 | `package.json` | `next@14.2.13` עם פגיעויות **קריטיות** (כולל עקיפת middleware), וגם `axios`, `form-data`, `tar` ועוד. סך הכול 26 | חובה לשדרג לפני כל פריסה |
| S11 | `.env` | יש בו `GOOGLE_CLIENT_SECRET` אמיתי ו-`NEXTAUTH_SECRET` חלש. ✅ הקובץ ב-`.gitignore`, ובדקתי שהוא **לא** נכנס להיסטוריית git | לפני פרודקשן: ליצור `NEXTAUTH_SECRET` חזק, ולהחזיק סודות נפרדים לכל סביבה |

### 🔴 באגים שוברים

| # | מיקום | הבעיה |
|---|---|---|
| B1 | `src/app/auth/register/page.js:44` (שינוי שלא נכנס לקומיט) | `const registerUser = await registerUser(form)` מסתיר את הפונקציה ויזרוק `ReferenceError`. בשורה 33 `res.json()` בלי `await`, ובשורה 35 יש שימוש ב-`result` שלא מוגדר. **ההרשמה מהממשק שבורה.** הגרסה שבקומיט עבדה |
| B2 | `src/lib/user.js:136` | `getProfileByUserId({ userId })` מצפה לאובייקט, אבל מקבלת מחרוזת (`api/profile/route.js:26,70`), ולכן `where: { userId: undefined }`. **הפרופיל תמיד מחזיר 500** (אומת) |
| B3 | `src/lib/user.js:116-131` | תאריך לידה נשלח כמחרוזת `"YYYY-MM-DD"` לשדה `DateTime` (ההמרה בהערה בשורה 127), ולכן עדכון פרופיל עם תאריך ייכשל |
| B4 | `src/app/api/produce/route.js:55-57` | מחזיר Promise במקום `Response`, ולכן 500 כשצופים במודעות של מגדל אחר (אומת) |
| B5 | `src/app/api/auth/[...nextauth]/route.js:50` | `createUser` בלי `await`, אז שגיאות נבלעות והמשתמש עלול לא להיווצר לפני ה-callback של `jwt` |
| B6 | `src/app/api/auth/[...nextauth]/route.js:63` + `src/lib/user.js:97` | `UpdateUserLastLogin(profile.email)` שולחת מחרוזת, אבל הפונקציה מפרקת `{ email }`, ולכן ה-update נכשל (ובלי `await`) |
| B7 | `src/app/api/auth/[...nextauth]/route.js:52` + `schema.prisma` (`username @unique`) | שם המשתמש ב-Google הוא השם המלא, אז שני משתמשים בשם "John Smith" יגרמו לכשל ביצירה |
| B8 | `src/app/tradingMarket/components/marketplace/ProduceCard.js:28` | ניווט ל-`/trade/${id}`, שמחזיר 404. הנתיב הנכון הוא `/tradingMarket/trade/${id}` |
| B9 | `src/app/tradingMarket/(pages)/trades/page.js` | קובץ ריק, ולכן 500 |
| B10 | `ProduceCard.js:46-58` | מציג `unit` ו-`produceStatus`, שלא קיימים בסכמה (יש `isAvailable`) |
| B11 | `ProducesList.js:12-13` + `produce/page.js:88-90` | המחיקה נקראת פעמיים, פעם ברשימה ופעם בעמוד |
| B12 | `ProducesList.js:52-57` | "Restore" פותח טופס עריכה, אבל לא מחזיר `isAvailable: true`, אז אי אפשר לשחזר |
| B13 | `ProduceForm.js:36-44` | `onSubmit` בלי `await`, הטופס נסגר לפני שהשמירה מסתיימת, והמשתנה `submitting` לא בשימוש. שגיאות לא מוצגות למשתמש |
| B14 | `produce/page.js:18,24` | משתמש לא מחובר נתקע לנצח על "Loading produces..." |
| B15 | `src/lib/produce.js:18-28` | fallback שקט ל-mock בפיתוח, כך שתקלת DB נראית כמו "הכול עובד" |

### 🟠 ארכיטקטורה ואיכות קוד

| # | מיקום | הבעיה | למה זה חשוב |
|---|---|---|---|
| A1 | `src/prisma/{accounts,trade,travel}` | **3 מסדי נתונים נפרדים** | אין Foreign Key בין `produces.traderId` ל-`users.id`, ואי אפשר לעשות join כדי להציג את שם המגדל, את הצ'אט ואת העסקאות. עסקאות (transactions) בין מסדים לא אפשריות. **המלצה: DB אחד עם סכמה אחת** |
| A2 | `.gitignore:44-48` | כל תיקיות ה-**migrations מוחרגות מ-git** (חוץ מהישנה) | אי אפשר לשחזר את ה-DB במחשב אחר או בפרודקשן. חובה להכניס migrations ל-git |
| A3 | `src/prisma/schema.prisma`, `src/lib/prisma.js`, `src/prisma/migrations/` | סכמה "מונוליטית" ישנה ו-client ברירת מחדל שלא בשימוש. דווקא בה מוגדרים `Trade` ו-`TradeProduce` | בלבול: שתי מקורות אמת. אפשר להשתמש בה כבסיס לסכמה המאוחדת |
| A4 | `src/prisma/trade/schema.prisma:19-25, 42-69` | מודל `Trader` שלא בשימוש, ו-`Trade` בהערות | |
| A5 | `src/prisma/accounts/schema.prisma` | `firstName`, `lastName` ו-`birthdate` כפולים ב-`User` וב-`Profile`. `profileId Int?` חסר משמעות. יש שינויים שלא נכנסו לקומיט | |
| A6 | `src/lib/prisma/tradeClient.js:3`, `travelClient.js:3` | לא singleton, ולכן נוצרים חיבורים חדשים בכל hot-reload | מיצוי חיבורים ל-DB |
| A7 | `src/context/UserContext.js` | כפילות של `useSession`. נטען פעם אחת ולא מתעדכן אחרי התחברות. בשימוש רק ב-travel | למחוק |
| A8 | `src/services/` מול `src/lib/` | ערבוב של axios ו-fetch, ואין שכבת API אחידה או טיפול שגיאות מרכזי | |
| A9 | `src/app/api/*` | אין הגנה מרכזית על נתיבים (middleware). כל route בודק סשן בעצמו, וחלקם שוכחים | שורש של S2 |
| A10 | `package.json` | תלויות לא בשימוש: `bcryptjs`, `pg`, `dayjs`, `@next-auth/prisma-adapter`. אחרי הסרת ה-travel גם `openai` | |
| A11 | שם המוצר | שלושה שמות שונים: "Produce Exchange Platform" (`Header.js`, `layout.js`, `Footer.js`), "Home Growers Platform" (`Navbar.js:56`), ו-"NeighborTrade" (README) | |
| A12 | `src/components/layout/Navbar.js:14-18` | הניווט מכיל **רק קישורי travel**. אין קישור לשוק או למודעות שלי. בדף הבית (`src/app/page.js:15-17`) יש כפתור "Planning Trip" | |
| A13 | `src/app/auth/default.js`, `src/components/LogoutButton.js`, `ProduceTradeCard.js`, `src/utils/constants.js` (ריק), `src/services/localStorageService.js` | קוד מת או קבצים ריקים | |
| A14 | תיקיית ההורה `neighbortrade/` | `.venv`, `travel-openai.ipynb`, `travel*.http`, `travel.md` שייכים ל-travel. `produce_api_test.http` מיושן (`growerId` במקום `traderId`) | |
| A15 | כללי | JavaScript בלי טיפוסים ובלי ולידציית סכמה | באגים כמו B2, B4 ו-B6 היו נתפסים מראש עם TypeScript או zod |

### מודול ה-travel (יוסר, לתיעוד בלבד)
כל מה שתחת `src/app/travel/`, `src/app/api/travel/`, `src/lib/travel/`, `src/services/travel*`, `src/prisma/travel/`, `public/data/mockItinerary.json` ו-`src/lib/prisma/travelClient.js`. הוא מכיל: שימוש ב-API ישן של OpenAI (`text-davinci-003`), URL קשיח `http://localhost:3000` (`activitiesService.js:5`), נתוני mock (`travelService.js:6-36`, `mockActivities.js`), מחיקת טיול בלי בדיקת בעלות (`api/travel/trip/[tripId]/route.js:46`), יצירת פעילות בלי התחברות (`api/travel/activities/route.js:23`), ו-`getServerSession({ request })` שגוי (`api/travel/trip/route.js:20`). הוא גם לא תואם ל-DB `travel`, שעבר ל-AITravelApp.

---

## 4. מה חסר כדי שזה יהיה מוצר מוגמר

### ✅ חובה ל-MVP

**פיצ'רים**
1. **צ'אט לכל מודעה** בין המתעניין למפרסם: רשימת שיחות ("ההודעות שלי"), שיחה, וסימון של הודעות שלא נקראו. בהתחלה מספיק polling כל כמה שניות, ו-real-time (WebSocket/Pusher/Supabase Realtime) אפשר להוסיף אחר כך.
2. **סגירת עסקה ("מה שסוכם")** מתוך הצ'אט: המפרסם מסמן "מסוכם" עם סוג (חינם או החלפה), כמות ותיאור התמורה. הכמות במודעה מתעדכנת, ובכמות 0 המודעה נסגרת. סטטוסים: פתוח, סוכם, הושלם, בוטל.
3. **מודעה שלמה**: שם, תיאור, כמות ו**יחידה**, **תמונה** (העלאה), **מיקום** (עיר או שכונה), ואפשרות "בחינם" או "מעדיף החלפה".
4. **שוק**: הצגת שם המגדל והמיקום, חיפוש, **סינון לפי מיקום**, ועמוד מודעה מלא עם כפתור "שלח הודעה".
5. **פרופיל ציבורי** של מגדל עם המודעות שלו, ופרופיל אישי שעובד (תיקון B2 ו-B3).
6. **אימות תקין**: תיקון S1, סיסמה מינימלית, הודעות שגיאה ברורות ומסלול "שכחתי סיסמה". אימות אימייל רצוי.

**מסביב**
7. **הרשאות**: middleware שמגן על דפים ו-API, ובדיקת בעלות בכל עריכה או מחיקה.
8. **ולידציה** לכל קלט בשרת (למשל zod) והחזרת הודעות שגיאה ידידותיות.
9. **מצבי UI**: טעינה (skeleton), מצב ריק ("עוד אין מודעות, פרסם ראשון"), שגיאה עם "נסה שוב", ו-toast במקום `alert()`.
10. **ניווט ומיתוג**: שם אחד, Navbar עם שוק, המודעות שלי וההודעות, ודף בית שמסביר את המוצר.
11. **רספונסיביות למובייל**: רוב השימוש יהיה מהטלפון.
12. **DB אחד ו-migrations ב-git**, וסקריפט seed עם נתוני דוגמה.
13. **משתני סביבה**: `.env.example` מעודכן, ובדיקה באתחול שכל המשתנים קיימים.
14. **טסטים בסיסיים**: unit ל-lib (הרשאות, ולידציה, סגירת עסקה), טסטי API לנתיבים המרכזיים, ו-E2E אחד (Playwright) לזרימה: הרשמה, פרסום מודעה, הודעה וסגירת עסקה.
15. **לוגים וטיפול בשגיאות**: logger אחד בשרת (בלי `console.log` מפוזרים ובלי להדפיס מידע רגיש) ו-`error.js`/`not-found.js` ב-App Router.
16. **תיעוד**: README נקי (מה זה, דרישות Node 18.20+, הרצה מקומית, migrations, seed ומשתני סביבה).
17. **פריסה**: למשל Vercel ו-Postgres מנוהל (Neon/Supabase), עם `prisma migrate deploy` ב-build, דומיין, Google OAuth עם redirect לפרודקשן, ואחסון תמונות (למשל Vercel Blob, S3 או Cloudinary).
18. **בסיס משפטי מינימלי**: תנאי שימוש ומדיניות פרטיות (יש איסוף מידע אישי כמו טלפון, מיקום ותאריך לידה).

### 💡 נחמד שיהיה בהמשך
- צ'אט real-time אמיתי והתראות (אימייל או push) על הודעה חדשה או הצעה.
- דירוגים וביקורות אחרי עסקה ("אמינות המגדל").
- מפה של מודעות ומרחק מהמשתמש.
- עונתיות: "מה גדל עכשיו", התראה כשמישהו מפרסם פריט שחיפשת.
- מועדפים או "עקוב אחרי מגדל".
- דיווח על משתמש או מודעה, חסימה, ופאנל ניהול (`ADMIN` כבר קיים ב-enum).
- PWA או אפליקציית מובייל.
- מעבר ל-TypeScript.
- אנליטיקה ו-monitoring (Sentry).

### ✅ החלטה: שפה וקהל יעד
**עברית + RTL, לקהל בישראל, על תשתית רב-לשונית.** בעתיד יתווספו שפות נוספות, ולכן כבר מההתחלה אין טקסטים קשיחים בקוד: הכול עובר דרך קבצי תרגום (i18n), והוספת שפה תהיה הוספת קובץ ולא שינוי קוד. זה חלק מה-MVP: `<html lang="he" dir="rtl">`, כל הטקסטים בעברית (כולל הודעות שגיאה מהשרת), פונט שתומך בעברית (Geist לא תומך, למשל Heebo או Assistant), שימוש ב-Tailwind logical properties (`ms-`/`me-`/`ps-`/`pe-` במקום `ml-`/`mr-`) ומיקום לפי רשימת ערים/יישובים בישראל. מספרי טלפון בפורמט ישראלי ותאריכים בפורמט `he-IL`.

---

## 5. תוכנית עבודה

מאמץ: **ק** = קטן (עד חצי יום) · **ב** = בינוני (1–3 ימים) · **ג** = גדול (3+ ימים)

### שלב 0 – ייצוב (להחזיר את הפרויקט לחיים)
| # | משימה | עדיפות | מאמץ |
|---|---|---|---|
| 1 | **לגבות את המצב הנוכחי**: לבצע קומיט או branch לשינויים שלא נכנסו (`wip/travel-leftovers`) כדי שלא ילכו לאיבוד, ואז לחזור ל-`main` נקי | גבוהה | ק |
| 2 | להחזיר את דף ההרשמה לגרסה שעבדה (B1), כדי שאפשר יהיה ליצור משתמשים ולעבוד מחוברים בזמן הפיתוח | גבוהה | ק |
| 3 | **להסיר את מודול ה-travel** (קוד, API, lib, services, סכמה, client, mock, קישורים ב-Navbar ובדף הבית, `openai`), ולהעביר או למחוק את קבצי ה-travel בתיקיית ההורה | גבוהה | ק |
| 4 | לוודא ש-`npm run build` ו-`npm run lint` עוברים | גבוהה | ק |
| 5 | **לשדרג תלויות**: לפחות ל-Next 14.2.x האחרון (או 15), axios, next-auth ו-Prisma 5.22, ולהריץ `npm audit fix`. להסיר תלויות לא בשימוש (A10) | גבוהה | ב |

### שלב 1 – תשתית נכונה
| # | משימה | עדיפות | מאמץ |
|---|---|---|---|
| 6 | **לאחד ל-DB וסכמה אחת**: `User`, `Profile`, `Produce` (עם FK ל-User, יחידה, תמונה ומיקום), `Conversation`, `Message`, `Trade`. להוציא את ה-migrations מ-`.gitignore`, ליצור migration התחלתי נקי ולכתוב seed | גבוהה | ב |
| 7 | **שכבת הרשאות**: `middleware.js` לדפים מוגנים, ופונקציית עזר `requireUser()` ו-`assertOwner()` ב-API. לתקן את S2–S5 ואת S7 | גבוהה | ב |
| 8 | **ולידציה** עם zod לכל ה-API, מינימום סיסמה, וניקוי שדות (S6, S9) | גבוהה | ב |
| 9 | לתקן את באגי הפרופיל (B2–B4) | גבוהה | ק |
| 10 | לתקן את ניהול המודעות (B10–B15) ולהסיר את ה-mock | גבוהה | ק |
| 11 | להקים טסטים (Vitest + Playwright) ולכתוב טסטים להרשאות (מי רשאי לערוך/למחוק מה) | גבוהה | ב |

### שלב 2 – פיצ'רי הליבה
| # | משימה | עדיפות | מאמץ |
|---|---|---|---|
| 12 | **תשתית רב-לשונית (i18n) + עברית כברירת מחדל**: ספרייה כמו `next-intl`, כל הטקסטים בקבצי תרגום (`messages/he.json`, ובהמשך `en.json`, `ar.json` וכו'), `lang`/`dir` שנקבעים לפי השפה (RTL/LTR), logical properties ב-Tailwind כדי שאותו עיצוב יעבוד בשני הכיוונים, פונט שתומך בעברית, תאריכים ומספרים לפי locale, והודעות שגיאה מהשרת כקודים שמתורגמים בצד הלקוח. לאחד שם ומיתוג, ולבנות Navbar ודף בית חדשים (A11, A12) | גבוהה | ב |
| 13 | מודעה מלאה: יחידה, מיקום, "חינם / החלפה", **העלאת תמונה** | גבוהה | ב |
| 14 | שוק: כרטיס מתוקן, שם מגדל, סינון לפי מיקום, עמוד מודעה | גבוהה | ב |
| 15 | **צ'אט לכל מודעה**: API לשיחות ולהודעות, דף "ההודעות שלי", דף שיחה (polling) ומונה הודעות שלא נקראו | גבוהה | ג |
| 16 | **סגירת עסקה מתוך הצ'אט**: הצעה, אישור, עדכון כמות, ודף "העסקאות שלי" (במקום `trades` הריק) | גבוהה | ב |
| 17 | פרופיל ציבורי של מגדל | בינונית | ק |
| 18 | מצבי טעינה, ריק ושגיאה, toasts, ומעבר על מובייל | בינונית | ב |

### שלב 3 – ליטוש
| # | משימה | עדיפות | מאמץ |
|---|---|---|---|
| 19 | logger, `error.js`, `not-found.js` וניקוי `console.log` | בינונית | ק |
| 22 | README חדש ו-`.env.example` מעודכן | בינונית | ק |

### שלב 4 – התחברות ואבטחת חשבונות (נדחה לסוף לפי החלטה, **חובה לפני פריסה**)
עד השלב הזה ההתחברות נשארת פשוטה, רק כדי שיהיה משתמש מחובר בזמן הפיתוח.
> ⚠️ באג S1 (כניסה עם כל סיסמה) נשאר פתוח עד כאן. מקומית זה לא מזיק, אבל **אסור לפרוס את האתר או לשתף קישור ציבורי לפני שהשלב הזה הושלם.**

| # | משימה | עדיפות | מאמץ |
|---|---|---|---|
| 26 | לתקן את בדיקת הסיסמה (S1), להוסיף מינימום לסיסמה, ולכתוב טסט שמוודא שסיסמה שגויה נדחית | גבוהה | ק |
| 27 | לתקן את ההתחברות עם Google (B5–B7) | גבוהה | ק |
| 20 | rate-limit להתחברות, להרשמה ולשליחת הודעות | בינונית | ק |
| 21 | "שכחתי סיסמה" ואימות אימייל (שירות אימייל כמו Resend) | בינונית | ב |

### שלב 5 – השקה
| # | משימה | עדיפות | מאמץ |
|---|---|---|---|
| 23 | פריסה: Vercel, Postgres מנוהל ואחסון תמונות, `migrate deploy`, דומיין ו-OAuth לפרודקשן, ו-CI (GitHub Actions: lint, test, build) | גבוהה | ב |
| 24 | תנאי שימוש ומדיניות פרטיות | בינונית | ק |
| 25 | בדיקת משתמשים עם 3–5 שכנים אמיתיים ותיקונים | גבוהה | ב |

### אחרי ה-MVP
real-time והתראות · דירוגים · מפה · דיווח ומנהל · PWA · TypeScript · Sentry. כולם בעדיפות **נמוכה** בשלב זה.

---

### ✅ סטטוס (16/11/2026): שלב 0, משימות 1–4 הושלמו
- גיבוי: השינויים שלא נכנסו לקומיט שמורים ב-branch `wip/travel-leftovers`.
- דף ההרשמה חזר לגרסה שעבדה (הרשמה והתחברות נבדקו).
- מודול ה-travel הוסר, כולל `openai`, `UserContext` ומשתני ה-travel ב-`.env.example`. ב-Navbar יש עכשיו קישורים לשוק ולמודעות שלי.
- `npm run lint` ו-`npm run build` עוברים. כדי שה-build יעבור תוקנו גם `/auth/error` (Suspense) ו-`/tradingMarket/trades` (placeholder במקום קובץ ריק).

### ✅ סטטוס (16/11/2026): משימה 5 הושלמה
- **Next.js 14.2.13 → 16.4.6** (Turbopack), **React 18 → 19**, ESLint 8 → 9 (flat config ב-`eslint.config.mjs`, והסקריפט `lint` הוא עכשיו `eslint .`), next-auth 4.24.15, Prisma 5.22, axios ו-bcrypt 6. Next 14 הגיע לסוף חייו, ולפגיעויות הקריטיות אין בו תיקון, לכן נדרש מעבר גרסה ראשית.
- הוסרו תלויות שלא בשימוש: `bcryptjs`, `pg`, `dayjs`, `@next-auth/prisma-adapter` (A10).
- **`npm audit`: 0 פגיעויות** (S10).
- התאמות קוד ל-Next 16: `await params` ב-`api/produce/[id]`, ו-`useParams` בעמוד העסקה. ב-`produce/page.js` וב-`ProduceForm.js` טופלו שני דפוסים שכללי ה-lint החדשים של React פוסלים.
- **דרישת Node עודכנה: 20.9 ומעלה** (README יעודכן במשימה 22).
- נבדק: lint (0 שגיאות), build, כל הדפים, הרשמה והתחברות, ויצירה/קריאה/עדכון/מחיקה של מודעה.
- ⚠️ נשארה אזהרת build: ה-Prisma clients שנוצרים בתוך `src/prisma/generated` גורמים ל-Turbopack לעקוב אחרי כל הפרויקט. מקומית זה לא משפיע. זה ייפתר במשימה 6, כשיהיה DB אחד וה-client ייווצר במיקום ברירת המחדל.
- הבא בתור: משימה 6 (איחוד ל-DB אחד).

### 👉 הצעד הראשון
**משימות 1–4 ביחד:** לגבות את השינויים שלא נכנסו לקומיט ל-branch נפרד, להחזיר את דף ההרשמה לגרסה שעבדה, להסיר את מודול ה-travel ולוודא שה-build עובר. אחרי זה יש בסיס יציב עם משתמש מחובר, ומשם ממשיכים למוצר עצמו. תיקוני ההתחברות והאבטחה של החשבונות נדחו לשלב 4, לפני הפריסה.
