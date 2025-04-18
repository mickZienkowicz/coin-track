'use server';

import { getTranslations } from 'next-intl/server';

import { prisma } from '@/lib/prisma/prisma-client';
import { getSelectedFamily } from '@/server/family/queries/get-selected-family';
import { getUser } from '@/server/user/queries/get-user';

export const deleteFortuneDebt = async ({ debtId }: { debtId: string }) => {
  const t = await getTranslations('errors.fortune.debt.delete');
  await getUser();

  const knownErrors = {
    invalidDebtData: t('invalidDebtData'),
    failedToDeleteDebt: t('failedToDeleteDebt'),
    familyNotFound: t('familyNotFound'),
    debtNotFound: t('debtNotFound'),
    debtNotBelongsToFamily: t('debtNotBelongsToFamily')
  };

  const selectedFamily = await getSelectedFamily();

  try {
    if (!selectedFamily) {
      throw new Error(knownErrors.familyNotFound);
    }

    const debt = await prisma.debt.findUnique({
      where: {
        id: debtId
      }
    });

    if (!debt) {
      throw new Error(knownErrors.debtNotFound);
    }

    if (debt.familyId !== selectedFamily.id) {
      throw new Error(knownErrors.debtNotBelongsToFamily);
    }

    await prisma.debt.delete({
      where: {
        id: debtId
      }
    });

    return {
      success: true,
      message: t('success')
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
      message: isKnownError ? error.message : knownErrors.failedToDeleteDebt
    };
  }
};
