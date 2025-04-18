'use server';

import { auth } from '@clerk/nextjs/server';
import { compareAsc } from 'date-fns';
import { getLocale } from 'next-intl/server';

import { redirect } from '@/i18n/navigation';
import { getCurrentBudgetPeriod } from '@/lib/dates/get-current-budget-period';
import { getOccurenceInfo } from '@/lib/dates/get-next-occurance';
import { OutcomeWithOccurenceInfo } from '@/lib/dates/get-next-occurance/types';
import { getUtcMiddayDateOfGivenDate } from '@/lib/dates/get-utc-midday-date-of-given-date';
import { pathGenerators } from '@/lib/paths';
import { prisma } from '@/lib/prisma/prisma-client';
import { getBudget } from '@/server/budget/queries/get-budget';

export async function getOutcomes(): Promise<OutcomeWithOccurenceInfo[]> {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    const locale = await getLocale();

    redirect({ href: pathGenerators.home(), locale });

    throw new Error('Unauthorized');
  }

  const budget = await getBudget();

  if (!budget) {
    return [];
  }

  const outcomes = await prisma.outcome.findMany({
    where: {
      budgetId: budget.id
    }
  });

  const today = getUtcMiddayDateOfGivenDate(new Date());
  const { startDate } = await getCurrentBudgetPeriod(
    budget.startDate,
    budget.interval,
    today
  );
  return outcomes
    .map((income) => ({
      ...income,
      ...getOccurenceInfo({
        firstOccurrenceDate: income.date,
        recurrence: income.recurrence,
        interval: income.repeatEvery,
        repeatCount: income.repeatCount,
        stoppedAt: income.stoppedAt,
        today,
        currentBudgetStartDate: getUtcMiddayDateOfGivenDate(startDate)
      })
    }))
    .sort((a, b) => {
      if (a.isDisabled !== b.isDisabled) {
        return a.isDisabled ? 1 : -1;
      }
      return compareAsc(b.date, a.date);
    });
}
