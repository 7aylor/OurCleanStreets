-- CreateEnum
CREATE TYPE "public"."WeightUnit" AS ENUM ('POUNDS', 'KILOGRAMS');

-- AlterTable
ALTER TABLE "public"."Activities" ADD COLUMN     "trashWeight" DOUBLE PRECISION,
ADD COLUMN     "trashWeightUnit" "public"."WeightUnit" NOT NULL DEFAULT 'POUNDS';
