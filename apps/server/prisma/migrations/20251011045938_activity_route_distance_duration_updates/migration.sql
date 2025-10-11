/*
  Warnings:

  - You are about to drop the column `distance` on the `Activities` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Activities` table. All the data in the column will be lost.
  - Added the required column `duration` to the `CleanUpRoutes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Activities" DROP COLUMN "distance",
DROP COLUMN "duration";

-- AlterTable
ALTER TABLE "public"."CleanUpRoutes" ADD COLUMN     "duration" DOUBLE PRECISION NOT NULL;
