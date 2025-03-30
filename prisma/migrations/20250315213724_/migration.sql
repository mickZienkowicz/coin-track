-- AlterTable
ALTER TABLE "Budget" ALTER COLUMN "startDate" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "interval" SET DEFAULT 'MONTH';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currency" TEXT DEFAULT 'PLN',
ADD COLUMN     "language" TEXT DEFAULT 'pl',
ADD COLUMN     "timezone" TEXT DEFAULT 'Europe/Warsaw';
