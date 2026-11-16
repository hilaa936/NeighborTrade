import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

export default async function setup() {
  const url = process.env.DATABASE_URL_TEST;
  execSync("npx prisma migrate deploy", { env: { ...process.env, DATABASE_URL: url }, stdio: "ignore" });
  const db = new PrismaClient({ datasourceUrl: url });
  await db.$executeRawUnsafe("TRUNCATE users, listings, conversations, messages, trades CASCADE");
  await db.$disconnect();
}
