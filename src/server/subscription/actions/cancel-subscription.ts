'use server';

import { getTranslations } from 'next-intl/server';

import { prisma } from '@/lib/prisma/prisma-client';
import { stripe } from '@/lib/stripe';
import { getAuthenticatedUser } from '@/server/utils/get-authenticated-user';

export async function cancelSubscription({ familyId }: { familyId: string }) {
  const t = await getTranslations('errors.subscription.cancel');
  const user = await getAuthenticatedUser();

  const knownErrors = {
    failedToCancelSubscription: t('failedToCancelSubscription'),
    subscriptionNotFound: t('subscriptionNotFound'),
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

    if (!family.subscription) {
      return {
        success: true,
        message: t('success')
      };
    }

    if (!family.subscription.stripeSubscriptionId) {
      return {
        success: true,
        message: t('success')
      };
    }

    await stripe.subscriptions.cancel(family.subscription.stripeSubscriptionId);

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
        : knownErrors.failedToCancelSubscription
    };
  }
}
