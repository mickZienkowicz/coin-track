'use server';

import { getTranslations } from 'next-intl/server';
import type { Stripe } from 'stripe';

import { prisma } from '@/lib/prisma/prisma-client';

export async function updateSubscription(subscription: Stripe.Subscription) {
  const t = await getTranslations('errors.subscription.update');
  const { status, items, id: stripeSubscriptionId, customer } = subscription;

  const customerId = typeof customer === 'string' ? customer : customer.id;

  const knownErrors = {
    failedToUpdateSubscription: t('failedToUpdateSubscription'),
    subscriptionNotFound: t('subscriptionNotFound')
  };

  try {
    const existingSubscription = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId }
    });

    if (!existingSubscription) {
      throw new Error(knownErrors.subscriptionNotFound);
    }

    const updatedSubscription = await prisma.subscription.update({
      where: { stripeSubscriptionId },
      data: {
        status: status,
        stripePriceId: items.data[0].price.id,
        stripeCustomerId: customerId,
        currentPeriodStart: new Date(items.data[0].current_period_start * 1000),
        currentPeriodEnd: new Date(items.data[0].current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      }
    });

    return {
      success: true,
      message: t('success'),
      data: updatedSubscription
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
        : knownErrors.failedToUpdateSubscription
    };
  }
}
