/*
  Warnings:

  - You are about to drop the `PasswordToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PasswordToken" DROP CONSTRAINT "PasswordToken_userId_fkey";

-- DropTable
DROP TABLE "PasswordToken";

-- CreateTable
CREATE TABLE "JsonWebToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "JsonWebToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JsonWebToken_token_key" ON "JsonWebToken"("token");

-- AddForeignKey
ALTER TABLE "JsonWebToken" ADD CONSTRAINT "JsonWebToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
