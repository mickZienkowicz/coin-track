'use server';

import { RecurrenceType } from '@prisma/client';
import { getTranslations } from 'next-intl/server';

import { dateSchemaWithMinDate } from '@/lib/dates/date-schema-with-min-date';
import { getUtcMiddayDateOfGivenDate } from '@/lib/dates/get-utc-midday-date-of-given-date';
import { prisma } from '@/lib/prisma/prisma-client';
import { getAuthenticatedUser } from '@/server/utils/get-authenticated-user';

export async function stopPouch({ id, date }: { id: string; date: Date }) {
  const t = await getTranslations('errors.pouch.stop');
  const user = await getAuthenticatedUser();

  const knownErrors = {
    failedToStopPouch: t('failedToStopPouch'),
    pouchNotFound: t('pouchNotFound'),
    pouchNotBelongsToUser: t('pouchNotBelongsToUser'),
    invalidPouchData: t('invalidPouchData'),
    oneTimePouchCannotBeStopped: t('oneTimePouchCannotBeStopped')
  };

  try {
    const pouch = await prisma.pouch.findUnique({
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

    if (!pouch) {
      throw new Error(knownErrors.pouchNotFound);
    }

    if (pouch.recurrence === RecurrenceType.ONE_TIME) {
      throw new Error(knownErrors.oneTimePouchCannotBeStopped);
    }

    const isPouchBelongsToUser = pouch.budget.family.users.some(
      (familyUser) => familyUser.userId === user.id
    );

    if (!isPouchBelongsToUser) {
      throw new Error(knownErrors.pouchNotBelongsToUser);
    }

    if (
      !dateSchemaWithMinDate({ message: 'Date is required.' }).safeParse(date)
        .success
    ) {
      throw new Error(knownErrors.invalidPouchData);
    }

    const updatedPouch = await prisma.pouch.update({
      where: {
        id
      },
      data: {
        stoppedAt: getUtcMiddayDateOfGivenDate(date)
      }
    });

    return {
      success: true,
      message: 'Pouch stopped successfully.',
      data: updatedPouch
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
      message: isKnownError ? error.message : knownErrors.failedToStopPouch
    };
  }
}
