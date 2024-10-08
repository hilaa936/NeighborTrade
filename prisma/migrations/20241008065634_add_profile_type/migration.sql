/*
  Warnings:

  - You are about to drop the column `role` on the `Profile` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ProfileType" AS ENUM ('BEGIN', 'MEDIUM', 'PRO');

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "role",
ADD COLUMN     "type" "ProfileType" NOT NULL DEFAULT 'BEGIN';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "name" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user',
ALTER COLUMN "password" DROP NOT NULL;
