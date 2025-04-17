'use server';

import { getTranslations } from 'next-intl/server';

import { getCurrentBudgetPeriod } from '@/lib/dates/get-current-budget-period';
import { getUtcMiddayDateOfGivenTimezone } from '@/lib/dates/get-utc-midday-date-of-given-date/get-utc-midday-date-of-given-timezone';
import { prisma } from '@/lib/prisma/prisma-client';
import { getAuthenticatedUser } from '@/server/utils/get-authenticated-user';

export async function finishGoal({ goalId }: { goalId: string }) {
  const t = await getTranslations('errors.goal.finish');
  const user = await getAuthenticatedUser();

  const knownErrors = {
    failedToFinishGoal: t('failedToFinishGoal'),
    goalNotFound: t('goalNotFound'),
    goalNotBelongsToUser: t('goalNotBelongsToUser'),
    budgetNotFound: t('budgetNotFound')
  };

  try {
    const goal = await prisma.goal.findUnique({
      where: {
        id: goalId
      },
      include: {
        family: {
          include: {
            users: true,
            budget: true
          }
        }
      }
    });

    if (!goal) {
      throw new Error(knownErrors.goalNotFound);
    }

    if (!goal.family.budget) {
      throw new Error(knownErrors.budgetNotFound);
    }

    const isGoalBelongsToUser = goal.family.users.some(
      (familyUser) => familyUser.userId === user.id
    );

    if (!isGoalBelongsToUser) {
      throw new Error(knownErrors.goalNotBelongsToUser);
    }

    const { endDate } = await getCurrentBudgetPeriod(
      goal.family.budget.startDate,
      goal.family.budget.interval,
      getUtcMiddayDateOfGivenTimezone(goal.family.timezone)
    );

    await prisma.outcome.deleteMany({
      where: {
        goalId,
        date: {
          gt: endDate
        }
      }
    });

    const finishedGoal = await prisma.goal.update({
      where: { id: goalId },
      data: {
        finishedAt: new Date()
      }
    });

    return {
      success: true,
      message: t('success'),
      data: finishedGoal
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
      message: isKnownError ? error.message : knownErrors.failedToFinishGoal
    };
  }
}
