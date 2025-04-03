'use server';

import { RecurrenceType } from '@prisma/client';
import { getTranslations } from 'next-intl/server';

import { dateSchemaWithMinDate } from '@/lib/dates/date-schema-with-min-date/date-schema-with-min-date';
import { getUtcMiddayDateOfGivenDate } from '@/lib/dates/get-utc-midday-date-of-given-date';
import { prisma } from '@/lib/prisma/prisma-client';
import { getAuthenticatedUser } from '@/server/utils/get-authenticated-user';

export async function stopIncome({ id, date }: { id: string; date: Date }) {
  const t = await getTranslations('errors.income.stop');
  const user = await getAuthenticatedUser();

  const knownErrors = {
    failedToStopIncome: t('failedToStopIncome'),
    incomeNotFound: t('incomeNotFound'),
    incomeNotBelongsToUser: t('incomeNotBelongsToUser'),
    invalidIncomeData: t('invalidIncomeData'),
    oneTimeIncomeCannotBeStopped: t('oneTimeIncomeCannotBeStopped')
  };

  try {
    const income = await prisma.income.findUnique({
      where: {
        id
      },
      include: {
        budget: {
          include: {
            family: {
              include: {
                users: true
              }
            }
          }
        }
      }
    });

    if (!income) {
      throw new Error(knownErrors.incomeNotFound);
    }

    if (income.recurrence === RecurrenceType.ONE_TIME) {
      throw new Error(knownErrors.oneTimeIncomeCannotBeStopped);
    }

    const isIncomeBelongsToUser = income.budget.family.users.some(
      (familyUser) => familyUser.userId === user.id
    );

    if (!isIncomeBelongsToUser) {
      throw new Error(knownErrors.incomeNotBelongsToUser);
    }

    if (!dateSchemaWithMinDate().safeParse(date).success) {
      throw new Error(knownErrors.invalidIncomeData);
    }

    const updatedIncome = await prisma.income.update({
      where: {
        id
      },
      data: {
        stoppedAt: getUtcMiddayDateOfGivenDate(date)
      }
    });

    return {
      success: true,
      message: t('success'),
      data: updatedIncome
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
      message: isKnownError ? error.message : knownErrors.failedToStopIncome
    };
  }
}
