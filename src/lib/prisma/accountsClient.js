import { PrismaClient } from "@/prisma/generated/accounts";

let accountsClient;

if (process.env.NODE_ENV === "production") {
  accountsClient = new PrismaClient();
} else {
  // In development, use a global variable to persist the Prisma Client
  if (!global.accountsClient) {
    global.accountsClient = new PrismaClient();
  }
  accountsClient = global.accountsClient;
}

export default accountsClient;
