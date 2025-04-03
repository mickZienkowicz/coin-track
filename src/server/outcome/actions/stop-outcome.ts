'use server';

import { RecurrenceType } from '@prisma/client';
import { getTranslations } from 'next-intl/server';

import { dateSchemaWithMinDate } from '@/lib/dates/date-schema-with-min-date';
import { getUtcMiddayDateOfGivenDate } from '@/lib/dates/get-utc-midday-date-of-given-date';
import { prisma } from '@/lib/prisma/prisma-client';
import { getAuthenticatedUser } from '@/server/utils/get-authenticated-user';

export async function stopOutcome({ id, date }: { id: string; date: Date }) {
  const t = await getTranslations('errors.outcome.stop');
  const user = await getAuthenticatedUser();

  const knownErrors = {
    failedToStopOutcome: t('failedToStopOutcome'),
    outcomeNotFound: t('outcomeNotFound'),
    outcomeNotBelongsToUser: t('outcomeNotBelongsToUser'),
    invalidOutcomeData: t('invalidOutcomeData'),
    oneTimeOutcomeCannotBeStopped: t('oneTimeOutcomeCannotBeStopped')
  };

  try {
    const outcome = await prisma.outcome.findUnique({
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

    if (!outcome) {
      throw new Error(knownErrors.outcomeNotFound);
    }

    if (outcome.recurrence === RecurrenceType.ONE_TIME) {
      throw new Error(knownErrors.oneTimeOutcomeCannotBeStopped);
    }

    const isOutcomeBelongsToUser = outcome.budget.family.users.some(
      (familyUser) => familyUser.userId === user.id
    );

    if (!isOutcomeBelongsToUser) {
      throw new Error(knownErrors.outcomeNotBelongsToUser);
    }

    if (
      !dateSchemaWithMinDate({ message: 'Date is required.' }).safeParse(date)
        .success
    ) {
      throw new Error(knownErrors.invalidOutcomeData);
    }

    const updatedOutcome = await prisma.outcome.update({
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
      data: updatedOutcome
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
      message: isKnownError ? error.message : knownErrors.failedToStopOutcome
    };
  }
}
