'use server';

import { SubscriptionStatus } from '@prisma/client';
import { addDays, isAfter } from 'date-fns';
import { getTranslations } from 'next-intl/server';

import { prisma } from '@/lib/prisma/prisma-client';
import { getSelectedFamily } from '@/server/family/queries/get-selected-family';
import { getUser } from '@/server/user/queries/get-user';

export const getSubscription = async () => {
  const t = await getTranslations('errors.subscription.get');
  await getUser();

  const knownErrors = {
    failedToGetSubscription: t('failedToGetSubscription'),
    familyNotFound: t('familyNotFound'),
    subscriptionNotFound: t('subscriptionNotFound'),
    subscriptionCanceled: t('subscriptionCanceled')
  };

  const selectedFamily = await getSelectedFamily();

  try {
    if (!selectedFamily) {
      throw new Error(knownErrors.familyNotFound);
    }

    if (selectedFamily.hasFreeAccount) {
      return {
        subscription: undefined,
        isInTrial: false,
        trialEndsAt: null,
        hasFreeAccount: true
      };
    }

    const subscription = await prisma.subscription.findUnique({
      where: {
        familyId: selectedFamily.id
      }
    });

    const now = new Date();
    const trialEndDate = addDays(selectedFamily.createdAt, 7);
    const isTrialExpired = isAfter(now, trialEndDate);

    if (
      !isTrialExpired &&
      (!subscription || subscription.status !== SubscriptionStatus.active)
    ) {
      return {
        subscription: undefined,
        isInTrial: true,
        trialEndsAt: trialEndDate,
        hasFreeAccount: false
      };
    }

    if (!subscription) {
      throw new Error(knownErrors.subscriptionNotFound);
    }

    if (subscription.status !== SubscriptionStatus.active) {
      throw new Error(knownErrors.subscriptionCanceled);
    }

    return {
      subscription: subscription,
      isInTrial: false,
      trialEndsAt: null,
      hasFreeAccount: false
    };
  } catch (error) {
    const isKnownError =
      error instanceof Error &&
      Object.values(knownErrors).includes(error.message);

    if (!isKnownError) {
      console.error(error);
    }

    return {
      subscription: undefined,
      isInTrial: false,
      trialEndsAt: null,
      hasFreeAccount: false
    };
  }
};
