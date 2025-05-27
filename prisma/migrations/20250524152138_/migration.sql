/*
  Warnings:

  - You are about to drop the column `trialEndsAt` on the `Subscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "trialEndsAt",
ALTER COLUMN "stripeSubscriptionId" DROP NOT NULL;
