/*
  Warnings:

  - You are about to drop the column `creationDate` on the `CleanUpRoutes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."CleanUpRoutes" DROP COLUMN "creationDate",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
