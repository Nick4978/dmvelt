/*
  Warnings:

  - You are about to drop the column `unread` on the `Lien` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Lien" DROP COLUMN "unread",
ADD COLUMN     "readFlag" BOOLEAN NOT NULL DEFAULT false;
