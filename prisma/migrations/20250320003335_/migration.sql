/*
  Warnings:

  - Made the column `currency` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `timezone` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "currency" SET NOT NULL,
ALTER COLUMN "timezone" SET NOT NULL;
