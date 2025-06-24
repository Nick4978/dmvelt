/*
  Warnings:

  - Added the required column `updatedAt` to the `Dealer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `color` on table `Vehicle` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mileage` on table `Vehicle` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Dealer" ADD COLUMN     "address" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "city" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lienHolderId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "phone" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "zipCode" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "state" SET DEFAULT '';

-- AlterTable
ALTER TABLE "DealerUser" ALTER COLUMN "isActive" SET DEFAULT true;

-- AlterTable
ALTER TABLE "Lien" ALTER COLUMN "lienholder" SET DEFAULT '';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isGlobalAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isLocalAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "name" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Vehicle" ALTER COLUMN "make" SET DEFAULT '',
ALTER COLUMN "model" SET DEFAULT '',
ALTER COLUMN "year" SET DEFAULT 0,
ALTER COLUMN "color" SET NOT NULL,
ALTER COLUMN "color" SET DEFAULT '',
ALTER COLUMN "mileage" SET NOT NULL,
ALTER COLUMN "mileage" SET DEFAULT 0;
