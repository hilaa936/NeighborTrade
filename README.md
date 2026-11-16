# שכנים מגדלים (NeighborTrade)

A community web app for home growers: neighbors post surplus vegetables, fruit, herbs, plants and seeds, and others ask for them in a chat, for free or in exchange. There is no money and no prices. The UI is Hebrew/RTL, built on i18n so more languages can be added.

## Features

- **Market**: search (Hebrew-aware), categories, offer type (free / exchange / open to offers), distance filter.
- **Location privacy**: users pick a locality (or share a location rounded to ~1 km). Others only ever see "in your city", an approximate distance, or the city name. Coordinates never reach the client, and uploaded photos are re-encoded to strip EXIF/GPS.
- **Listings**: photos (up to 3), quantity and unit, custom categories, expiry (3–30 days) or "always available".
- **Messages**: one chat per listing and neighbor, laid out like a messaging app, with unread badges (polling).
- **Trades**: either side proposes "what was agreed" (quantity + terms); the other accepts. The quantity comes off the listing, and the trade can then be marked handed over or cancelled (which returns the quantity).

## Stack

Next.js 16 (App Router), React 19, NextAuth v4 (email/password + optional Google), Prisma 5 + PostgreSQL, next-intl, Tailwind CSS 3, zod, sharp. Tests use Vitest (service layer against a real test DB) and Playwright (end to end, desktop + mobile).

## Getting started

Requires Node 20.9+ and PostgreSQL.

```bash
npm install
cp .env.example .env          # set DATABASE_URL, DATABASE_URL_TEST, NEXTAUTH_SECRET
createdb neighbortrade_dev && createdb neighbortrade_test
npx prisma migrate dev        # create the schema
npm run db:seed               # demo data (wipes the dev DB!) – every demo user's password is password123
npm run dev                   # http://localhost:3000
```

Demo users: `dana@example.com`, `yossi@example.com`, `maya@example.com`, `ahmad@example.com`, `rivka@example.com`, `omer@example.com`.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build / server |
| `npm run lint` | ESLint |
| `npm test` | Vitest service tests (uses `DATABASE_URL_TEST`, wipes it) |
| `npm run test:e2e` | Playwright: builds the app and runs it on port 3100 against the test DB |
| `npm run db:migrate` | Create/apply a migration after editing `prisma/schema.prisma` |
| `npm run db:seed` | Reset the dev DB with demo data |

## Project layout

```
prisma/              schema, migrations, seed
messages/he.json     all UI text (add <locale>.json + src/i18n/config.js for a new language)
src/app/             pages and API route handlers (thin)
src/server/          business logic + authorization (db, auth, listings, chat, trades, uploads, validation)
src/lib/             shared client/server helpers (options, localities, geo, search, api client)
src/components/      UI components
src/proxy.js         redirects guests away from private pages (pages/APIs check the session too)
tests/server, tests/e2e
```

API errors are returned as `{ error: "<code>" }`, and the client translates the code with `errors.<code>` in the messages file.

## Before deploying

See `PROJECT_REVIEW.md` (Hebrew) for the full plan. In short:

- **Image storage**: `src/server/uploads.js` writes to local `uploads/`. On serverless hosting, replace it with object storage (e.g. Vercel Blob).
- **Rate limiting**: `src/server/rateLimit.js` is in-memory, so it only works on a single instance. Use Redis/Upstash on multi-instance hosts.
- **Secrets**: generate a strong `NEXTAUTH_SECRET` and use per-environment Google OAuth credentials.
- **Migrations**: run `npx prisma migrate deploy` on deploy.
- **Legal**: the terms and privacy pages are drafts and need a legal review.
