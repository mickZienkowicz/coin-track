'use server';

import { addHours, isAfter } from 'date-fns';
import { getTranslations } from 'next-intl/server';
import { z } from 'zod';

import { dateSchemaWithMinDate } from '@/lib/dates/date-schema-with-min-date';
import { getCurrentBudgetPeriod } from '@/lib/dates/get-current-budget-period';
import { getUtcMiddayDateOfGivenDate } from '@/lib/dates/get-utc-midday-date-of-given-date';
import { getUtcMiddayDateOfGivenTimezone } from '@/lib/dates/get-utc-midday-date-of-given-date/get-utc-midday-date-of-given-timezone';
import { prisma } from '@/lib/prisma/prisma-client';
import { getBudget } from '@/server/budget/queries/get-budget';
import { getAuthenticatedUser } from '@/server/utils/get-authenticated-user';

import { updateGoalSchema } from '../schemas/update-goal-schema';
import { getGoalCurrentSavings } from '../utils/get-goal-current-savings';
import { getGoalOutcomes } from '../utils/get-goal-outcomes';

export const updateGoal = async ({
  data
}: {
  data: z.infer<typeof updateGoalSchema>;
}) => {
  const t = await getTranslations('errors.goal.update');
  const user = await getAuthenticatedUser();

  const knownErrors = {
    invalidIncomeData: t('invalidIncomeData'),
    budgetNotFound: t('budgetNotFound'),
    failedToUpdateGoal: t('failedToUpdateGoal'),
    goalNotFound: t('goalNotFound'),
    endDateMustBeInFuture: t('endDateMustBeInFuture'),
    goalNotBelongsToUser: t('goalNotBelongsToUser')
  };

  const budget = await getBudget();

  try {
    if (!budget) {
      throw new Error(knownErrors.budgetNotFound);
    }

    if (!updateGoalSchema.safeParse(data).success) {
      throw new Error(knownErrors.invalidIncomeData);
    }

    if (!dateSchemaWithMinDate().safeParse(data.endDate).success) {
      throw new Error(knownErrors.invalidIncomeData);
    }

    const goal = await prisma.goal.findUnique({
      where: {
        id: data.id
      },
      include: {
        goalBudgetOutcomes: true,
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

    if (
      !isAfter(
        data.endDate,
        addHours(getUtcMiddayDateOfGivenDate(new Date()), 4)
      )
    ) {
      throw new Error(knownErrors.endDateMustBeInFuture);
    }

    const { endDate, startDate } = await getCurrentBudgetPeriod(
      goal.family.budget.startDate,
      goal.family.budget.interval,
      getUtcMiddayDateOfGivenTimezone(goal.family.timezone)
    );

    await prisma.outcome.deleteMany({
      where: {
        goalId: data.id,
        date: {
          gt: endDate
        }
      }
    });

    const newOutcomes = await getGoalOutcomes({
      goalName: data.name,
      startDate: endDate,
      endDate: data.endDate,
      savingInterval: data.savingInterval,
      missingAmount:
        data.valueCents -
        getGoalCurrentSavings(
          goal.goalBudgetOutcomes,
          startDate,
          endDate,
          data.initialDepositCents
        )
    });

    await prisma.goal.update({
      where: {
        id: data.id
      },
      data: {
        name: data.name,
        valueCents: data.valueCents,
        initialDepositCents: data.initialDepositCents,
        endDate: getUtcMiddayDateOfGivenDate(data.endDate),
        savingInterval: data.savingInterval,
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
      data: goal
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
      message: isKnownError ? error.message : knownErrors.failedToUpdateGoal
    };
  }
};
