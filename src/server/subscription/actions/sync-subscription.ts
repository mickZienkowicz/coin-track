'use server';

import { cache } from 'react';

import { stripe } from '@/lib/stripe';

import { updateSubscription } from './update-subscription';

const CACHE_TIME = 30 * 60 * 1000;

const lastSyncMap = new Map<string, number>();

export const syncSubscription = cache(async (stripeSubscriptionId: string) => {
  try {
    const lastSync = lastSyncMap.get(stripeSubscriptionId);
    const now = Date.now();

    if (lastSync && now - lastSync < CACHE_TIME) {
      return;
    }

    const stripeSubscription =
      await stripe.subscriptions.retrieve(stripeSubscriptionId);

    await updateSubscription(stripeSubscription);

    lastSyncMap.set(stripeSubscriptionId, now);
  } catch (error) {
    console.error('Failed to sync subscription:', error);
  }
});
