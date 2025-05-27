'use server';

import { Subscription, SubscriptionStatus } from '@prisma/client';
import { addDays, isAfter } from 'date-fns';
import { getTranslations } from 'next-intl/server';

import { prisma } from '@/lib/prisma/prisma-client';
import { getSelectedFamily } from '@/server/family/queries/get-selected-family';
import { getUser } from '@/server/user/queries/get-user';

export const checkSubscription = async (): Promise<{
  success: boolean;
  message: string;
  isTrial: boolean;
  trialEndsAt: Date | null;
  data?: Subscription;
}> => {
  const t = await getTranslations('errors.subscription.get');
  await getUser();

  const knownErrors = {
    failedToGetSubscription: t('failedToGetSubscription'),
    familyNotFound: t('familyNotFound'),
    subscriptionNotFound: t('subscriptionNotFound'),
    subscriptionNotActive: t('subscriptionNotActive')
  };

  const selectedFamily = await getSelectedFamily();

  try {
    if (!selectedFamily) {
      throw new Error(knownErrors.familyNotFound);
    }

    const now = new Date();
    const trialEndDate = addDays(selectedFamily.createdAt, 7);
    const isTrialExpired = isAfter(now, trialEndDate);

    if (!isTrialExpired) {
      return {
        success: true,
        isTrial: true,
        trialEndsAt: trialEndDate,
        message: t('success')
      };
    }

    if (selectedFamily.hasFreeAccount) {
      return {
        success: true,
        isTrial: false,
        trialEndsAt: null,
        message: t('success')
      };
    }

    let subscription = await prisma.subscription.findUnique({
      where: {
        familyId: selectedFamily.id
      }
    });

    if (!subscription) {
      throw new Error(knownErrors.subscriptionNotFound);
    }

    if (subscription.status !== SubscriptionStatus.active) {
      throw new Error(knownErrors.subscriptionNotActive);
    }

    return {
      success: true,
      isTrial: false,
      trialEndsAt: null,
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
      isTrial: false,
      trialEndsAt: null,
      message: isKnownError
        ? error.message
        : knownErrors.failedToGetSubscription
    };
  }
};
