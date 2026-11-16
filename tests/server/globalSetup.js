import { execSync } from "node:child_process";

// Bring the test database schema up to date before any test runs
export default function setup() {
  execSync("npx prisma migrate deploy", {
    env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL_TEST },
    stdio: "ignore",
  });
}
