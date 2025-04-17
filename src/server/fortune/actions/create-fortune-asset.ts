'use server';

import { getTranslations } from 'next-intl/server';
import { z } from 'zod';

import { getUtcMiddayDateOfGivenDate } from '@/lib/dates/get-utc-midday-date-of-given-date';
import { prisma } from '@/lib/prisma/prisma-client';
import { getSelectedFamily } from '@/server/family/queries/get-selected-family';
import { getUser } from '@/server/user/queries/get-user';

import { fortuneAssetSchema } from '../schemas/fortune-asset-schema';

export const createFortuneAsset = async ({
  data
}: {
  data: z.infer<typeof fortuneAssetSchema>;
}) => {
  const t = await getTranslations('errors.goal.create');
  await getUser();

  const knownErrors = {
    invalidAssetData: t('invalidAssetData'),
    failedToCreateAsset: t('failedToCreateAsset'),
    familyNotFound: t('familyNotFound')
  };

  const selectedFamily = await getSelectedFamily();

  try {
    if (!selectedFamily) {
      throw new Error(knownErrors.familyNotFound);
    }

    if (!fortuneAssetSchema.safeParse(data).success) {
      throw new Error(knownErrors.invalidAssetData);
    }

    const asset = await prisma.asset.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        familyId: selectedFamily.id,
        valueCents: {
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
      data: asset
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
      message: isKnownError ? error.message : knownErrors.failedToCreateAsset
    };
  }
};
