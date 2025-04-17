'use server';

import { getTranslations } from 'next-intl/server';

import { prisma } from '@/lib/prisma/prisma-client';
import { getAuthenticatedUser } from '@/server/utils/get-authenticated-user';

export async function deleteGoal({ goalId }: { goalId: string }) {
  const t = await getTranslations('errors.goal.delete');
  const user = await getAuthenticatedUser();

  const knownErrors = {
    failedToDeleteGoal: t('failedToDeleteGoal'),
    goalNotFound: t('goalNotFound'),
    goalNotBelongsToUser: t('goalNotBelongsToUser')
  };

  try {
    const goal = await prisma.goal.findUnique({
      where: {
        id: goalId
      },
      include: {
        family: {
          include: {
            users: true
          }
        }
      }
    });

    if (!goal) {
      throw new Error(knownErrors.goalNotFound);
    }

    const isGoalBelongsToUser = goal.family.users.some(
      (familyUser) => familyUser.userId === user.id
    );

    if (!isGoalBelongsToUser) {
      throw new Error(knownErrors.goalNotBelongsToUser);
    }

    const deletedGoal = await prisma.goal.delete({
      where: { id: goalId }
    });

    return {
      success: true,
      message: t('success'),
      data: deletedGoal
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
      message: isKnownError ? error.message : knownErrors.failedToDeleteGoal
    };
  }
}
