'use server';

import { getTranslations } from 'next-intl/server';
import { z } from 'zod';

import { getUtcMiddayDateOfGivenDate } from '@/lib/dates/get-utc-midday-date-of-given-date';
import { prisma } from '@/lib/prisma/prisma-client';
import { getSelectedFamily } from '@/server/family/queries/get-selected-family';
import { getUser } from '@/server/user/queries/get-user';

import { fortuneDebtSchema } from '../schemas/fortune-debt-schema';

export const createFortuneDebt = async ({
  data
}: {
  data: z.infer<typeof fortuneDebtSchema>;
}) => {
  const t = await getTranslations('errors.goal.create');
  await getUser();

  const knownErrors = {
    invalidDebtData: t('invalidDebtData'),
    failedToCreateDebt: t('failedToCreateDebt'),
    familyNotFound: t('familyNotFound')
  };

  const selectedFamily = await getSelectedFamily();

  try {
    if (!selectedFamily) {
      throw new Error(knownErrors.familyNotFound);
    }

    if (!fortuneDebtSchema.safeParse(data).success) {
      throw new Error(knownErrors.invalidDebtData);
    }

    const debt = await prisma.debt.create({
      data: {
        name: data.name,
        description: data.description,
        familyId: selectedFamily.id,
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
      data: debt
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
      message: isKnownError ? error.message : knownErrors.failedToCreateDebt
    };
  }
};
