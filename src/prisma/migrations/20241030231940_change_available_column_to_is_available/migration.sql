/*
  Warnings:

  - You are about to drop the column `available` on the `produce` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "produce" DROP COLUMN "available",
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true;
