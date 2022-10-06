/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `tokens` table. All the data in the column will be lost.
  - Added the required column `hashedRefreshToken` to the `tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tokens" DROP COLUMN "refreshToken",
ADD COLUMN     "hashedRefreshToken" TEXT NOT NULL;
