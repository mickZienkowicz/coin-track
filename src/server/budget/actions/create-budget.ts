'use server';

import { Interval } from '@prisma/client';
import { getTranslations } from 'next-intl/server';

import { dateSchemaWithMinDate } from '@/lib/dates/date-schema-with-min-date';
import { getUtcMiddayDateOfGivenDate } from '@/lib/dates/get-utc-midday-date-of-given-date';
import { prisma } from '@/lib/prisma/prisma-client';
import { getAuthenticatedUser } from '@/server/utils/get-authenticated-user';

export const createBudget = async ({
  familyId,
  startDate,
  interval,
  transferPouchBalance
}: {
  familyId: string;
  startDate: Date;
  interval: Interval;
  transferPouchBalance: boolean;
}) => {
  const t = await getTranslations('errors.budget.create');
  const user = await getAuthenticatedUser();

  const knownErrors = {
    budgetNotFound: t('budgetNotFound'),
    failedToCreateBudget: t('failedToCreateBudget'),
    notAllowedToCreateBudget: t('notAllowedToCreateBudget'),
    invalidBudgetData: t('invalidBudgetData'),
    budgetAlreadyExists: t('budgetAlreadyExists')
  };

  try {
    const family = await prisma.family.findUnique({
      where: {
        id: familyId
      },
      include: {
        budget: true,
        users: {
          include: {
            user: true
          }
        }
      }
    });

    if (!family) {
      throw new Error(knownErrors.budgetNotFound);
    }

    if (
      family.users.some(({ user: familyUser }) => familyUser.id !== user.id)
    ) {
      throw new Error(knownErrors.notAllowedToCreateBudget);
    }

    if (!dateSchemaWithMinDate().safeParse(startDate).success) {
      throw new Error(knownErrors.invalidBudgetData);
    }

    if (family.budget) {
      throw new Error(knownErrors.budgetAlreadyExists);
    }

    const budget = await prisma.budget.create({
      data: {
        startDate: getUtcMiddayDateOfGivenDate(startDate),
        interval,
        transferPouchBalance,
        family: {
          connect: {
            id: familyId
          }
        }
      }
    });

    return {
      success: true,
      message: t('success'),
      data: budget
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
      message: isKnownError ? error.message : knownErrors.failedToCreateBudget
    };
  }
};
