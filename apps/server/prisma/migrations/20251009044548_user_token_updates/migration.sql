/*
  Warnings:

  - The primary key for the `RefreshTokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `token` on the `RefreshTokens` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1024)`.
  - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `email` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `passwordHash` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - A unique constraint covering the columns `[username]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `id` on the `RefreshTokens` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `RefreshTokens` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `username` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `Users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."RefreshTokens" DROP CONSTRAINT "RefreshTokens_userId_fkey";

-- AlterTable
ALTER TABLE "public"."RefreshTokens" DROP CONSTRAINT "RefreshTokens_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "token" SET DATA TYPE VARCHAR(1024),
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
ADD CONSTRAINT "RefreshTokens_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Users" DROP CONSTRAINT "Users_pkey",
ADD COLUMN     "username" VARCHAR(50) NOT NULL,
ADD COLUMN     "zipcode" VARCHAR(10),
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "passwordHash" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "public"."Users"("username");

-- AddForeignKey
ALTER TABLE "public"."RefreshTokens" ADD CONSTRAINT "RefreshTokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
