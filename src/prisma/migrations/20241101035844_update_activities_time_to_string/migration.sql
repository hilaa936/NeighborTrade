/*
  Warnings:

  - Added the required column `like` to the `UserActivity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserActivity" ADD COLUMN     "like" BOOLEAN NOT NULL;
