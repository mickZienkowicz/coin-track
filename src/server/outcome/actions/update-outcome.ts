'use server';

import { RecurrenceType } from '@prisma/client';
import { getTranslations } from 'next-intl/server';

import { prisma } from '@/lib/prisma/prisma-client';
import { getAuthenticatedUser } from '@/server/utils/get-authenticated-user';

import {
  updateOneTimeOutcomeSchema,
  updateOutcomeSchema
} from '../schemas/update-outcome-schema';

export async function updateOutcome({
  id,
  data
}: {
  id: string;
  data: {
    name: string;
    category: string;
    date?: Date;
    valueCents?: number;
  };
}) {
  const t = await getTranslations('errors.outcome.update');
  const user = await getAuthenticatedUser();

  const knownErrors = {
    failedToUpdateOutcome: t('failedToUpdateOutcome'),
    outcomeNotFound: t('outcomeNotFound'),
    outcomeNotBelongsToUser: t('outcomeNotBelongsToUser'),
    invalidOutcomeData: t('invalidOutcomeData')
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

    const isOutcomeBelongsToUser = outcome.budget.family.users.some(
      (familyUser) => familyUser.userId === user.id
    );

    if (!isOutcomeBelongsToUser) {
      throw new Error(knownErrors.outcomeNotBelongsToUser);
    }

    if (outcome.recurrence === RecurrenceType.ONE_TIME) {
      if (!updateOneTimeOutcomeSchema.safeParse(data).success) {
        throw new Error(knownErrors.invalidOutcomeData);
      }

      const updatedOutcome = await prisma.outcome.update({
        where: {
          id
        },
        data: {
          name: data.name,
          category: data.category,
          date: data.date || outcome.date,
          valueCents: data.valueCents || outcome.valueCents
        }
      });

      return {
        success: true,
        message: t('success'),
        data: updatedOutcome
      };
    }

    if (!updateOutcomeSchema.safeParse(data).success) {
      throw new Error(knownErrors.invalidOutcomeData);
    }

    const updatedOutcome = await prisma.outcome.update({
      where: {
        id
      },
      data: {
        name: data.name,
        category: data.category
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
    }
    console.error(error);

    return {
      success: false,
      message: isKnownError ? error.message : knownErrors.failedToUpdateOutcome
    };
  }
}
