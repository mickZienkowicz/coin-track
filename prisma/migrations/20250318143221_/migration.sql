/*
  Warnings:

  - You are about to drop the `Expense` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_budgetId_fkey";

-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_goalId_fkey";

-- DropTable
DROP TABLE "Expense";

-- CreateTable
CREATE TABLE "Outcome" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "valueCents" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "recurrence" "RecurrenceType" NOT NULL,
    "repeatCount" INTEGER,
    "repeatEvery" "Interval",
    "goalId" TEXT,
    "budgetId" TEXT NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "stoppedAt" TIMESTAMP(3),

    CONSTRAINT "Outcome_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Outcome" ADD CONSTRAINT "Outcome_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outcome" ADD CONSTRAINT "Outcome_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE CASCADE ON UPDATE CASCADE;
