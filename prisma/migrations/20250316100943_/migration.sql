/*
  Warnings:

  - Added the required column `name` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Made the column `recurrence` on table `Expense` required. This step will fail if there are existing NULL values in that column.
  - Made the column `budgetId` on table `Expense` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `name` to the `Income` table without a default value. This is not possible if the table is not empty.
  - Made the column `recurrence` on table `Income` required. This step will fail if there are existing NULL values in that column.
  - Made the column `budgetId` on table `Income` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `budgetId` to the `Pouch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Pouch` table without a default value. This is not possible if the table is not empty.
  - Made the column `recurrence` on table `Pouch` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "recurrence" SET NOT NULL,
ALTER COLUMN "budgetId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Income" ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "recurrence" SET NOT NULL,
ALTER COLUMN "budgetId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Pouch" ADD COLUMN     "budgetId" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "recurrence" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Pouch" ADD CONSTRAINT "Pouch_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE CASCADE ON UPDATE CASCADE;
