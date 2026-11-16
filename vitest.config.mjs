import path from "node:path";
import { config as loadEnv } from "dotenv";
import { defineConfig } from "vitest/config";

loadEnv({ quiet: true });
if (!process.env.DATABASE_URL_TEST) throw new Error("DATABASE_URL_TEST is not set (see .env.example)");

export default defineConfig({
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  test: {
    include: ["tests/server/**/*.test.js"],
    env: { DATABASE_URL: process.env.DATABASE_URL_TEST, NODE_ENV: "test" },
    globalSetup: ["tests/server/globalSetup.js"],
    // Test files share one database
    fileParallelism: false,
  },
});
