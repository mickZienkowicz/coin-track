/*
  Warnings:

  - You are about to drop the column `repeatUntil` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `repeatUntil` on the `Income` table. All the data in the column will be lost.
  - You are about to drop the column `repeatUntil` on the `Pouch` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "repeatUntil";

-- AlterTable
ALTER TABLE "Income" DROP COLUMN "repeatUntil";

-- AlterTable
ALTER TABLE "Pouch" DROP COLUMN "repeatUntil";
