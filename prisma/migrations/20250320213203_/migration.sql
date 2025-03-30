/*
  Warnings:

  - You are about to drop the column `adjustForOverspentPouch` on the `Budget` table. All the data in the column will be lost.
  - You are about to drop the column `carryOverUnusedPouch` on the `Budget` table. All the data in the column will be lost.
  - You are about to drop the column `transferBudgetBalance` on the `Budget` table. All the data in the column will be lost.
  - You are about to drop the column `transferBudgetBalanceStartDate` on the `Budget` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Budget" DROP COLUMN "adjustForOverspentPouch",
DROP COLUMN "carryOverUnusedPouch",
DROP COLUMN "transferBudgetBalance",
DROP COLUMN "transferBudgetBalanceStartDate",
ADD COLUMN     "transferPouchBalance" BOOLEAN NOT NULL DEFAULT false;
