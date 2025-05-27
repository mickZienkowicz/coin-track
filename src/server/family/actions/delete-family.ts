'use server';

import { getTranslations } from 'next-intl/server';

import { prisma } from '@/lib/prisma/prisma-client';
import { cancelSubscription } from '@/server/subscription/actions/cancel-subscription';
import { getAuthenticatedUser } from '@/server/utils/get-authenticated-user';

export async function deleteFamily({ familyId }: { familyId: string }) {
  const t = await getTranslations('errors.family.delete');
  const user = await getAuthenticatedUser();

  const knownErrors = {
    failedToDeleteFamily: t('failedToDeleteFamily'),
    familyNotFound: t('familyNotFound'),
    notFamilyOwner: t('notFamilyOwner')
  };

  try {
    const family = await prisma.family.findUnique({
      where: { id: familyId },
      include: {
        subscription: true
      }
    });

    if (!family) {
      throw new Error(knownErrors.familyNotFound);
    }

    if (family.ownerId !== user.id) {
      throw new Error(knownErrors.notFamilyOwner);
    }

    const { success: subscriptionCanceled, message: subscriptionMessage } =
      await cancelSubscription({
        familyId
      });

    if (!subscriptionCanceled) {
      console.error('Unable to cancel subscription: ', subscriptionMessage, {
        family,
        familySubscription: family.subscription
      });
    }

    await prisma.family.delete({
      where: { id: familyId }
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
      message: isKnownError ? error.message : knownErrors.failedToDeleteFamily
    };
  }
}
