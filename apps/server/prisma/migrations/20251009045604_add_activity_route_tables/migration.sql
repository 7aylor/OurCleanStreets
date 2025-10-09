-- CreateTable
CREATE TABLE "public"."Activities" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "activityDate" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "mostCommonItem" TEXT,
    "cleanUpRouteId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CleanUpRoutes" (
    "id" SERIAL NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "coordinates" JSONB NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CleanUpRoutes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Activities_cleanUpRouteId_key" ON "public"."Activities"("cleanUpRouteId");

-- AddForeignKey
ALTER TABLE "public"."Activities" ADD CONSTRAINT "Activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Activities" ADD CONSTRAINT "Activities_cleanUpRouteId_fkey" FOREIGN KEY ("cleanUpRouteId") REFERENCES "public"."CleanUpRoutes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
