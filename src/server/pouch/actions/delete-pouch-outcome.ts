'use server';

import { getTranslations } from 'next-intl/server';

import { prisma } from '@/lib/prisma/prisma-client';
import { getAuthenticatedUser } from '@/server/utils/get-authenticated-user';

export async function deletePouchOutcome({
  pouchOutcomeId
}: {
  pouchOutcomeId: string;
}) {
  const t = await getTranslations('errors.pouchOutcome.delete');
  const user = await getAuthenticatedUser();

  const knownErrors = {
    failedToDeletePouchOutcome: t('failedToDeletePouchOutcome'),
    pouchOutcomeNotFound: t('pouchNotFound'),
    pouchOutcomeNotBelongsToUser: t('pouchNotBelongsToUser')
  };

  try {
    const pouchOutcome = await prisma.pouchExpense.findUnique({
      where: {
        id: pouchOutcomeId
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

    const deletedPouchOutcome = await prisma.pouchExpense.delete({
      where: { id: pouchOutcomeId }
    });

    return {
      success: true,
      message: 'Pouch outcome deleted successfully.',
      data: deletedPouchOutcome
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
        : knownErrors.failedToDeletePouchOutcome
    };
  }
}
