/*
  Warnings:

  - You are about to drop the column `valueCents` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `valueCents` on the `Debt` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "valueCents",
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "Debt" DROP COLUMN "valueCents",
ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "FortuneValue" (
    "id" TEXT NOT NULL,
    "valueCents" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "assetId" TEXT,
    "debtId" TEXT,

    CONSTRAINT "FortuneValue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FortuneValue" ADD CONSTRAINT "FortuneValue_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FortuneValue" ADD CONSTRAINT "FortuneValue_debtId_fkey" FOREIGN KEY ("debtId") REFERENCES "Debt"("id") ON DELETE SET NULL ON UPDATE CASCADE;
