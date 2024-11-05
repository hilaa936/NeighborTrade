import { PrismaClient } from "@/prisma/generated/travel";

const travelClient = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_TRAVEL,
    },
  },
});
export default travelClient;
