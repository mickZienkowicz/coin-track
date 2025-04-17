'use server';

import { auth } from '@clerk/nextjs/server';
import { Goal, Outcome } from '@prisma/client';
import { getLocale } from 'next-intl/server';

import { redirect } from '@/i18n/navigation';
import { getCurrentBudgetPeriod } from '@/lib/dates/get-current-budget-period';
import { getUtcMiddayDateOfGivenTimezone } from '@/lib/dates/get-utc-midday-date-of-given-date/get-utc-midday-date-of-given-timezone';
import { pathGenerators } from '@/lib/paths';
import { prisma } from '@/lib/prisma/prisma-client';
import { getBudget } from '@/server/budget/queries/get-budget';
import { getSelectedFamily } from '@/server/family/queries/get-selected-family';

import { getGoalCurrentSavings } from '../utils/get-goal-current-savings';
import { getGoalOutcomeStatus } from '../utils/get-goal-outcome-status';
import { GoalOutcomeStatus } from '../utils/get-goal-outcome-status/get-goal-outcome-status';

export type GoalWithAdditionalInfo = Goal & {
  goalBudgetOutcomes: Array<Outcome & { status: GoalOutcomeStatus }>;
  currentSavings: number;
};

export async function getGoals(): Promise<GoalWithAdditionalInfo[]> {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    const locale = await getLocale();
    redirect({ href: pathGenerators.home(), locale });
    throw new Error('Unauthorized');
  }

  const family = await getSelectedFamily();

  if (!family) {
    return [];
  }

  const budget = await getBudget();
  if (!budget) {
    return [];
  }

  const { startDate, endDate } = await getCurrentBudgetPeriod(
    budget.startDate,
    budget.interval,
    getUtcMiddayDateOfGivenTimezone(budget.family.timezone)
  );

  const goals = await prisma.goal.findMany({
    where: {
      familyId: family.id
    },
    include: {
      goalBudgetOutcomes: {
        orderBy: {
          date: 'asc'
        }
      }
    },
    orderBy: {
      endDate: 'asc'
    }
  });

  const goalsWithOutcomeWithStatus = goals.map((goal) => ({
    ...goal,
    goalBudgetOutcomes: goal.goalBudgetOutcomes.map((outcome) => ({
      ...outcome,
      status: getGoalOutcomeStatus(outcome.date, startDate, endDate)
    }))
  }));

  const goalsWithAdditionalInfo = goalsWithOutcomeWithStatus.map((goal) => ({
    ...goal,
    currentSavings: getGoalCurrentSavings(
      goal.goalBudgetOutcomes,
      startDate,
      endDate,
      goal.initialDepositCents
    )
  }));

  return goalsWithAdditionalInfo;
}
