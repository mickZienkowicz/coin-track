'use server';

import { getTranslations } from 'next-intl/server';

import { getCurrentBudgetPeriod } from '@/lib/dates/get-current-budget-period';
import { getUtcMiddayDateOfGivenTimezone } from '@/lib/dates/get-utc-midday-date-of-given-date/get-utc-midday-date-of-given-timezone';
import { prisma } from '@/lib/prisma/prisma-client';
import { getBudget } from '@/server/budget/queries/get-budget';
import { getAuthenticatedUser } from '@/server/utils/get-authenticated-user';

import { getGoalCurrentSavings } from '../utils/get-goal-current-savings';
import { getGoalOutcomes } from '../utils/get-goal-outcomes';

export const updateGoalOutcome = async ({
  outcomeId,
  valueCents
}: {
  outcomeId: string;
  valueCents: number;
}) => {
  const t = await getTranslations('errors.goal.updateOutcome');
  const user = await getAuthenticatedUser();

  const knownErrors = {
    failedToUpdateGoalOutcome: t('failedToUpdateGoalOutcome'),
    goalOutcomeNotFound: t('goalOutcomeNotFound'),
    budgetNotFound: t('budgetNotFound'),
    goalNotFound: t('goalNotFound'),
    goalNotBelongsToUser: t('goalNotBelongsToUser')
  };

  const budget = await getBudget();

  try {
    if (!budget) {
      throw new Error(knownErrors.budgetNotFound);
    }

    const goalOutcome = await prisma.outcome.findUnique({
      where: {
        id: outcomeId
      },
      include: {
        goal: {
          include: {
            goalBudgetOutcomes: true,
            family: {
              include: {
                users: true,
                budget: true
              }
            }
          }
        }
      }
    });

    if (!goalOutcome) {
      throw new Error(knownErrors.goalOutcomeNotFound);
    }

    if (!goalOutcome.goal) {
      throw new Error(knownErrors.goalNotFound);
    }

    if (!goalOutcome.goal.family.budget) {
      throw new Error(knownErrors.budgetNotFound);
    }

    const isGoalBelongsToUser = goalOutcome.goal.family.users.some(
      (familyUser) => familyUser.userId === user.id
    );

    if (!isGoalBelongsToUser) {
      throw new Error(knownErrors.goalNotBelongsToUser);
    }

    const outcomeAfterUpdate = await prisma.outcome.update({
      where: {
        id: outcomeId
      },
      data: {
        valueCents
      },
      include: {
        goal: true
      }
    });

    const goalAfterUpdate = await prisma.goal.findUnique({
      where: {
        id: goalOutcome.goal.id
      },
      include: {
        goalBudgetOutcomes: true
      }
    });

    const { endDate, startDate } = await getCurrentBudgetPeriod(
      goalOutcome.goal.family.budget.startDate,
      goalOutcome.goal.family.budget.interval,
      getUtcMiddayDateOfGivenTimezone(goalOutcome.goal.family.timezone)
    );

    await prisma.outcome.deleteMany({
      where: {
        goalId: goalOutcome.goal.id,
        date: {
          gt: endDate
        }
      }
    });

    const newOutcomes = await getGoalOutcomes({
      goalName: goalOutcome.goal.name,
      startDate: endDate,
      endDate: goalOutcome.goal.endDate,
      savingInterval: goalOutcome.goal.savingInterval,
      missingAmount:
        (goalAfterUpdate?.valueCents ?? goalOutcome.goal.valueCents) -
        getGoalCurrentSavings(
          goalAfterUpdate?.goalBudgetOutcomes ??
            goalOutcome.goal.goalBudgetOutcomes,
          startDate,
          endDate,
          goalAfterUpdate?.initialDepositCents ??
            goalOutcome.goal.initialDepositCents
        )
    });

    await prisma.goal.update({
      where: {
        id: goalOutcome.goal.id
      },
      data: {
        goalBudgetOutcomes: {
          createMany: {
            data: newOutcomes.map((outcome) => ({
              ...outcome,
              budgetId: budget.id
            }))
          }
        }
      }
    });

    return {
      success: true,
      message: t('success'),
      data: outcomeAfterUpdate
    };
  } catch (error) {
    const isKnownError =
      error instanceof Error &&
      Object.values(knownErrors).includes(error.message);

    if (!isKnownError) {
      console.error(error);
    }
    return {
      success: false,
      message: isKnownError
        ? error.message
        : knownErrors.failedToUpdateGoalOutcome
    };
  }
};
