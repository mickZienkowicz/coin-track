'use server';

import { getTranslations } from 'next-intl/server';

import { prisma } from '@/lib/prisma/prisma-client';
import { getAuthenticatedUser } from '@/server/utils/get-authenticated-user';

export async function deleteOutcome({ outcomeId }: { outcomeId: string }) {
  const t = await getTranslations('errors.outcome.delete');
  const user = await getAuthenticatedUser();

  const knownErrors = {
    failedToDeleteOutcome: t('failedToDeleteOutcome'),
    outcomeNotFound: t('outcomeNotFound'),
    outcomeNotBelongsToUser: t('outcomeNotBelongsToUser')
  };

  try {
    const outcome = await prisma.outcome.findUnique({
      where: {
        id: outcomeId
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

    const deletedOutcome = await prisma.outcome.delete({
      where: { id: outcomeId }
    });

    return {
      success: true,
      message: 'Outcome deleted successfully.',
      data: deletedOutcome
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
      message: isKnownError ? error.message : knownErrors.failedToDeleteOutcome
    };
  }
}
