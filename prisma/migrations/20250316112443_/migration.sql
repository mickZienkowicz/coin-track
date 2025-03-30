/*
  Warnings:

  - You are about to drop the column `value` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `initialDeposit` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Income` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Pouch` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `PouchExpense` table. All the data in the column will be lost.
  - Added the required column `valueCents` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initialDepositCents` to the `Goal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valueCents` to the `Goal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valueCents` to the `Income` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valueCents` to the `Pouch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valueCents` to the `PouchExpense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "value",
ADD COLUMN     "valueCents" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Goal" DROP COLUMN "initialDeposit",
DROP COLUMN "value",
ADD COLUMN     "initialDepositCents" INTEGER NOT NULL,
ADD COLUMN     "valueCents" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Income" DROP COLUMN "value",
ADD COLUMN     "valueCents" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Pouch" DROP COLUMN "value",
ADD COLUMN     "valueCents" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PouchExpense" DROP COLUMN "value",
ADD COLUMN     "valueCents" INTEGER NOT NULL;
