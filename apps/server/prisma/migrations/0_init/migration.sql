-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."books" (
    "id" INTEGER NOT NULL,
    "title" VARCHAR NOT NULL,
    "author" VARCHAR NOT NULL,

    CONSTRAINT "test_pk" PRIMARY KEY ("id")
);

