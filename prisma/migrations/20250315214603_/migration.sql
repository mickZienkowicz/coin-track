/*
  Warnings:

  - A unique constraint covering the columns `[familyId]` on the table `Budget` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Budget_familyId_key" ON "Budget"("familyId");
