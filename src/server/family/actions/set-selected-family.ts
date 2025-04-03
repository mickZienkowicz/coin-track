'use server';

import { cookies } from 'next/headers';
import { getTranslations } from 'next-intl/server';

import { prisma } from '@/lib/prisma/prisma-client';
import { getAuthenticatedUser } from '@/server/utils/get-authenticated-user';

export const setSelectedFamily = async ({ familyId }: { familyId: string }) => {
  const t = await getTranslations('errors.family.setSelectedFamily');
  const user = await getAuthenticatedUser();
  const cookieStore = await cookies();

  const knownErrors = {
    failedToSetSelectedFamily: t('failedToSetSelectedFamily'),
    familyNotFound: t('familyNotFound')
  };

  try {
    const family = await prisma.family.findUnique({
      where: {
        id: familyId,
        users: {
          some: {
            userId: user.id
          }
        }
      }
    });

    if (!family) {
      throw new Error(knownErrors.familyNotFound);
    }

    cookieStore.set('selectedFamilyId', familyId);

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
      message: isKnownError
        ? error.message
        : knownErrors.failedToSetSelectedFamily
    };
  }
};
