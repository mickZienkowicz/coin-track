/*
  Warnings:

  - You are about to drop the column `currency` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `User` table. All the data in the column will be lost.
  - Made the column `currency` on table `Family` required. This step will fail if there are existing NULL values in that column.
  - Made the column `timezone` on table `Family` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Family" ALTER COLUMN "currency" SET NOT NULL,
ALTER COLUMN "timezone" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "currency",
DROP COLUMN "timezone";
