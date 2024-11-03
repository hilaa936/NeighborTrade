import { PrismaClient } from "@/prisma/generated/accounts";

const accountsClient = new PrismaClient();

export default accountsClient;
