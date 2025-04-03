'use server';

import { getTranslations } from 'next-intl/server';

import { prisma } from '@/lib/prisma/prisma-client';
import { getAuthenticatedUser } from '@/server/utils/get-authenticated-user';

export async function deleteIncome({ incomeId }: { incomeId: string }) {
  const t = await getTranslations('errors.income.delete');
  const user = await getAuthenticatedUser();

  const knownErrors = {
    failedToDeleteIncome: t('failedToDeleteIncome'),
    incomeNotFound: t('incomeNotFound'),
    incomeNotBelongsToUser: t('incomeNotBelongsToUser')
  };

  try {
    const income = await prisma.income.findUnique({
      where: {
        id: incomeId
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

    const isIncomeBelongsToUser = income.budget.family.users.some(
      (familyUser) => familyUser.userId === user.id
    );

    if (!isIncomeBelongsToUser) {
      throw new Error(knownErrors.incomeNotBelongsToUser);
    }

    const deletedIncome = await prisma.income.delete({
      where: { id: incomeId }
    });

    return {
      success: true,
      message: t('success'),
      data: deletedIncome
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
      message: isKnownError ? error.message : knownErrors.failedToDeleteIncome
    };
  }
}
