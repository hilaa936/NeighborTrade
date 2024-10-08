/*
  Warnings:

  - The `status` column on the `Trade` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TradeStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "Produce" DROP CONSTRAINT "Produce_growerId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- AlterTable
ALTER TABLE "Trade" DROP COLUMN "status",
ADD COLUMN     "status" "TradeStatus" NOT NULL DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produce" ADD CONSTRAINT "Produce_growerId_fkey" FOREIGN KEY ("growerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
