/*
  Warnings:

  - You are about to drop the column `deviceUDID` on the `tokens` table. All the data in the column will be lost.
  - Added the required column `terminalId` to the `tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tokens" DROP COLUMN "deviceUDID",
ADD COLUMN     "terminalId" TEXT NOT NULL;
