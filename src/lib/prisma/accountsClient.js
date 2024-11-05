import { PrismaClient } from "@/prisma/generated/accounts";

const accountsClient = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_ACCOUNTS, // Make sure to set this in your .env file
    },
  },
});

export default accountsClient;
