/*
  Warnings:

  - You are about to drop the column `isFinished` on the `Goal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Goal" DROP COLUMN "isFinished",
ADD COLUMN     "finishedAt" TIMESTAMP(3);
