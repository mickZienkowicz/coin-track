-- AlterTable
ALTER TABLE "Budget" ADD COLUMN     "transferBudgetBalance" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "transferBudgetBalanceStartDate" TIMESTAMP(3);
