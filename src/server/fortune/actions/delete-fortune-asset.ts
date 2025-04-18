'use server';

import { getTranslations } from 'next-intl/server';

import { prisma } from '@/lib/prisma/prisma-client';
import { getSelectedFamily } from '@/server/family/queries/get-selected-family';
import { getUser } from '@/server/user/queries/get-user';

export const deleteFortuneAsset = async ({ assetId }: { assetId: string }) => {
  const t = await getTranslations('errors.fortune.asset.delete');
  await getUser();

  const knownErrors = {
    invalidAssetData: t('invalidAssetData'),
    failedToDeleteAsset: t('failedToDeleteAsset'),
    familyNotFound: t('familyNotFound'),
    assetNotFound: t('assetNotFound'),
    assetNotBelongsToFamily: t('assetNotBelongsToFamily')
  };

  const selectedFamily = await getSelectedFamily();

  try {
    if (!selectedFamily) {
      throw new Error(knownErrors.familyNotFound);
    }

    const asset = await prisma.asset.findUnique({
      where: {
        id: assetId
      }
    });

    if (!asset) {
      throw new Error(knownErrors.assetNotFound);
    }

    if (asset.familyId !== selectedFamily.id) {
      throw new Error(knownErrors.assetNotBelongsToFamily);
    }

    await prisma.asset.delete({
      where: {
        id: assetId
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
      message: isKnownError ? error.message : knownErrors.failedToDeleteAsset
    };
  }
};
