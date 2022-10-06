/*
  Warnings:

  - You are about to drop the column `hashedRefreshToken` on the `tokens` table. All the data in the column will be lost.
  - Added the required column `refreshTokenSha1` to the `tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tokens" DROP COLUMN "hashedRefreshToken",
ADD COLUMN     "refreshTokenSha1" TEXT NOT NULL;
