'use server';

import { auth } from '@clerk/nextjs/server';
import { getLocale } from 'next-intl/server';

import { redirect } from '@/i18n/navigation';
import { getUtcMiddayDateOfGivenDate } from '@/lib/dates/get-utc-midday-date-of-given-date';
import { pathGenerators } from '@/lib/paths';
import { prisma } from '@/lib/prisma/prisma-client';

import { getAllBudgetPeriods } from '../utils/get-all-budget-periods';
import { getBudgetPeriodInfo } from '../utils/get-budget-period-info/get-budget-period-info';
import { getBudget } from './get-budget';

export async function getBudgetsHistory() {
  const budget = await getBudget();

  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    const locale = await getLocale();
    redirect({ href: pathGenerators.home(), locale });
    throw new Error('Unauthorized');
  }

  if (!budget) {
    return null;
  }

  const today = getUtcMiddayDateOfGivenDate(new Date());
  const periods = getAllBudgetPeriods(budget.startDate, budget.interval, today);

  const incomes = await prisma.income.findMany({
    where: { budgetId: budget.id }
  });

  const outcomes = await prisma.outcome.findMany({
    where: { budgetId: budget.id }
  });

  const pouches = await prisma.pouch.findMany({
    where: { budgetId: budget.id },
    include: {
      pouchExpenses: true
    }
  });

  return await Promise.all(
    periods.map(async (period) => {
      return await getBudgetPeriodInfo({
        startDate: getUtcMiddayDateOfGivenDate(period.startDate),
        endDate: getUtcMiddayDateOfGivenDate(period.endDate),
        incomes,
        outcomes,
        pouches,
        budgetInterval: budget.interval
      });
    })
  );
}
