/*
  Warnings:

  - Added the required column `name` to the `PouchExpense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PouchExpense" ADD COLUMN     "name" TEXT NOT NULL;
