'use server';

import { auth } from '@clerk/nextjs/server';
import { addHours, isAfter } from 'date-fns';
import { getLocale, getTranslations } from 'next-intl/server';
import { z } from 'zod';

import { redirect } from '@/i18n/navigation';
import { dateSchemaWithMinDate } from '@/lib/dates/date-schema-with-min-date';
import { getUtcMiddayDateOfGivenDate } from '@/lib/dates/get-utc-midday-date-of-given-date';
import { pathGenerators } from '@/lib/paths';
import { prisma } from '@/lib/prisma/prisma-client';
import { getBudget } from '@/server/budget/queries/get-budget';

import { createGoalSchema } from '../schemas/create-goal-schema';
import { getGoalOutcomes } from '../utils/get-goal-outcomes';

export const createGoal = async ({
  data
}: {
  data: z.infer<typeof createGoalSchema>;
}) => {
  const t = await getTranslations('errors.goal.create');
  const { userId: clerkUserId } = await auth();

  const knownErrors = {
    invalidIncomeData: t('invalidIncomeData'),
    budgetNotFound: t('budgetNotFound'),
    endDateMustBeInFuture: t('endDateMustBeInFuture'),
    failedToCreateGoal: t('failedToCreateGoal')
  };

  if (!clerkUserId) {
    const locale = await getLocale();

    redirect({ href: pathGenerators.home(), locale });

    throw new Error('Unauthorized');
  }

  const budget = await getBudget();

  try {
    if (!budget) {
      throw new Error(knownErrors.budgetNotFound);
    }

    if (!createGoalSchema.safeParse(data).success) {
      throw new Error(knownErrors.invalidIncomeData);
    }

    if (!dateSchemaWithMinDate().safeParse(data.endDate).success) {
      throw new Error(knownErrors.invalidIncomeData);
    }

    if (
      !isAfter(
        data.endDate,
        addHours(getUtcMiddayDateOfGivenDate(new Date()), 4)
      )
    ) {
      throw new Error(knownErrors.endDateMustBeInFuture);
    }

    const outcomes = await getGoalOutcomes({
      goalName: data.name,
      startDate: getUtcMiddayDateOfGivenDate(new Date()),
      endDate: data.endDate,
      savingInterval: data.savingInterval,
      missingAmount: data.valueCents - data.initialDepositCents
    });

    const goal = await prisma.goal.create({
      data: {
        name: data.name,
        valueCents: data.valueCents,
        initialDepositCents: data.initialDepositCents,
        endDate: getUtcMiddayDateOfGivenDate(data.endDate),
        savingInterval: data.savingInterval,
        withBudgetOutcomes: true,
        goalBudgetOutcomes: {
          createMany: {
            data: outcomes.map((outcome) => ({
              ...outcome,
              budgetId: budget.id
            }))
          }
        },
        family: {
          connect: {
            id: budget.familyId
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
      message: isKnownError ? error.message : knownErrors.failedToCreateGoal
    };
  }
};
