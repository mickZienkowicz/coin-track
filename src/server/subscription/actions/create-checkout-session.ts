'use server';

import { auth } from '@clerk/nextjs/server';
import { SubscriptionPlan, SubscriptionStatus } from '@prisma/client';
import { getTranslations } from 'next-intl/server';

import { Language } from '@/i18n/routing';
import { prisma } from '@/lib/prisma/prisma-client';
import { stripe, STRIPE_PLANS } from '@/lib/stripe';
import { getSelectedFamily } from '@/server/family/queries/get-selected-family';

export async function createCheckoutSession({
  plan,
  language
}: {
  plan: SubscriptionPlan;
  language: Language;
}) {
  await auth();

  const t = await getTranslations('errors.subscription.create');

  const knownErrors = {
    failedToCreateSubscription: t('failedToCreateSubscription'),
    familyNotFound: t('familyNotFound'),
    invalidSubscriptionData: t('invalidSubscriptionData'),
    notFamilyOwner: t('notFamilyOwner'),
    subscriptionAlreadyExists: t('subscriptionAlreadyExists')
  };

  try {
    const family = await getSelectedFamily();

    if (!family) {
      throw new Error(knownErrors.familyNotFound);
    }

    const subscription = await prisma.subscription.findUnique({
      where: { familyId: family.id }
    });

    if (subscription && subscription.status === SubscriptionStatus.active) {
      throw new Error(knownErrors.subscriptionAlreadyExists);
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: STRIPE_PLANS[plan],
          quantity: 1
        }
      ],
      locale: language === 'pl' ? 'pl' : 'en',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?canceled=true`,
      customer: family.stripeCustomerId,
      metadata: {
        familyId: family.id,
        plan: plan
      },
      subscription_data: {
        metadata: {
          familyId: family.id
        },
        description: `CoinTrack - ${family.name}`
      }
    });

    return {
      success: true,
      message: t('success'),
      data: {
        checkoutUrl: checkoutSession.url
      }
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
      data: null,
      message: isKnownError
        ? error.message
        : knownErrors.failedToCreateSubscription
    };
  }
}
