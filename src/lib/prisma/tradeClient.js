import { PrismaClient } from "@/prisma/generated/trade";

const tradeClient = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_TRADE, // Make sure to set this in your .env file
    },
  },
});

export default tradeClient;
