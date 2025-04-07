'use server';

import { Interval } from '@prisma/client';
import { getTranslations } from 'next-intl/server';

import { dateSchemaWithMinDate } from '@/lib/dates/date-schema-with-min-date';
import { getUtcMiddayDateOfGivenDate } from '@/lib/dates/get-utc-midday-date-of-given-date';
import { prisma } from '@/lib/prisma/prisma-client';
import { getAuthenticatedUser } from '@/server/utils/get-authenticated-user';

export const updateBudget = async ({
  id,
  startDate,
  interval,
  transferPouchBalance
}: {
  id: string;
  startDate: Date;
  interval: Interval;
  transferPouchBalance: boolean;
}) => {
  const t = await getTranslations('errors.budget.update');
  const user = await getAuthenticatedUser();

  const knownErrors = {
    budgetNotFound: t('budgetNotFound'),
    failedToUpdateBudget: t('failedToUpdateBudget'),
    notAllowedToUpdateBudget: t('notAllowedToUpdateBudget'),
    invalidBudgetData: t('invalidBudgetData')
  };

  try {
    const budget = await prisma.budget.findUnique({
      where: {
        id
      },
      include: {
        family: {
          include: {
            users: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });

    if (!budget) {
      throw new Error(knownErrors.budgetNotFound);
    }

    if (
      !budget.family.users.some(
        ({ user: budgetUser }) => budgetUser.id === user.id
      )
    ) {
      throw new Error(knownErrors.notAllowedToUpdateBudget);
    }

    if (!dateSchemaWithMinDate().safeParse(startDate).success) {
      throw new Error(knownErrors.invalidBudgetData);
    }

    const updatedBudget = await prisma.budget.update({
      where: {
        id
      },
      data: {
        startDate: getUtcMiddayDateOfGivenDate(startDate),
        interval,
        transferPouchBalance
      }
    });

    return {
      success: true,
      message: t('success'),
      data: updatedBudget
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
      message: isKnownError ? error.message : knownErrors.failedToUpdateBudget
    };
  }
};
