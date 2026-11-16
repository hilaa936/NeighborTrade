import { config as loadEnv } from "dotenv";
import { defineConfig, devices } from "@playwright/test";

loadEnv({ quiet: true });
const PORT = 3100;

// Runs a production build against the test database (DATABASE_URL_TEST)
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  globalSetup: "./tests/e2e/globalSetup.mjs",
  use: { baseURL: `http://localhost:${PORT}`, locale: "he-IL", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  workers: 1,
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    timeout: 300_000,
    reuseExistingServer: false,
    env: {
      DATABASE_URL: process.env.DATABASE_URL_TEST,
      NEXTAUTH_URL: `http://localhost:${PORT}`,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "e2e-secret",
    },
  },
});
