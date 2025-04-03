'use server';

import { getTranslations } from 'next-intl/server';
import { z } from 'zod';

import { prisma } from '@/lib/prisma/prisma-client';
import { getAuthenticatedUser } from '@/server/utils/get-authenticated-user';

import { updatePouchOutcomeSchema } from '../schemas/update-pouch-outcome-schema';

export async function updatePouchOutcome({
  id,
  data
}: {
  id: string;
  data: z.infer<typeof updatePouchOutcomeSchema>;
}) {
  const t = await getTranslations('errors.pouchOutcome.update');
  const user = await getAuthenticatedUser();

  const knownErrors = {
    failedToUpdatePouchOutcome: t('failedToUpdatePouchOutcome'),
    pouchOutcomeNotFound: t('pouchOutcomeNotFound'),
    pouchOutcomeNotBelongsToUser: t('pouchOutcomeNotBelongsToUser'),
    invalidPouchOutcomeData: t('invalidPouchOutcomeData')
  };

  try {
    const pouchOutcome = await prisma.pouchExpense.findUnique({
      where: {
        id
      },
      include: {
        pouch: {
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
        }
      }
    });

    if (!pouchOutcome) {
      throw new Error(knownErrors.pouchOutcomeNotFound);
    }

    const isPouchOutcomeBelongsToUser =
      pouchOutcome.pouch.budget.family.users.some(
        (familyUser) => familyUser.userId === user.id
      );

    if (!isPouchOutcomeBelongsToUser) {
      throw new Error(knownErrors.pouchOutcomeNotBelongsToUser);
    }

    if (!updatePouchOutcomeSchema.safeParse(data).success) {
      throw new Error(knownErrors.invalidPouchOutcomeData);
    }

    const updatedPouchOutcome = await prisma.pouchExpense.update({
      where: {
        id
      },
      data: {
        name: data.name,
        valueCents: data.valueCents,
        date: data.date
      }
    });

    return {
      success: true,
      message: t('success'),
      data: updatedPouchOutcome
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
        : knownErrors.failedToUpdatePouchOutcome
    };
  }
}
