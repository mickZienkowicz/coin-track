'use server';

import { getTranslations } from 'next-intl/server';
import { z } from 'zod';

import { getUtcMiddayDateOfGivenDate } from '@/lib/dates/get-utc-midday-date-of-given-date';
import { prisma } from '@/lib/prisma/prisma-client';
import { getSelectedFamily } from '@/server/family/queries/get-selected-family';
import { getUser } from '@/server/user/queries/get-user';

import { fortuneDebtSchema } from '../schemas/fortune-debt-schema';

export const updateFortuneDebt = async ({
  data,
  debtId
}: {
  data: z.infer<typeof fortuneDebtSchema>;
  debtId: string;
}) => {
  const t = await getTranslations('errors.fortune.debt.update');
  await getUser();

  const knownErrors = {
    invalidDebtData: t('invalidDebtData'),
    failedToUpdateDebt: t('failedToUpdateDebt'),
    familyNotFound: t('familyNotFound'),
    debtNotFound: t('debtNotFound'),
    debtNotBelongsToFamily: t('debtNotBelongsToFamily')
  };

  const selectedFamily = await getSelectedFamily();

  try {
    if (!selectedFamily) {
      throw new Error(knownErrors.familyNotFound);
    }

    if (!fortuneDebtSchema.safeParse(data).success) {
      throw new Error(knownErrors.invalidDebtData);
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

    const updatedDebt = await prisma.debt.update({
      where: {
        id: debtId
      },
      data: {
        name: data.name,
        description: data.description,
        values: {
          create: {
            valueCents: data.valueCents,
            date: getUtcMiddayDateOfGivenDate(new Date())
          }
        }
      }
    });

    return {
      success: true,
      message: t('success'),
      data: updatedDebt
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
      message: isKnownError ? error.message : knownErrors.failedToUpdateDebt
    };
  }
};
