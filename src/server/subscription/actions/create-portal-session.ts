'use server';

import { getTranslations } from 'next-intl/server';

import { Language } from '@/i18n/routing';
import { pathGenerators } from '@/lib/paths';
import { prisma } from '@/lib/prisma/prisma-client';
import { stripe } from '@/lib/stripe';
import { getSelectedFamily } from '@/server/family/queries/get-selected-family';
import { getAuthenticatedUser } from '@/server/utils/get-authenticated-user';

export async function createPortalSession({
  language
}: {
  language: Language;
}) {
  const t = await getTranslations('errors.subscription.portal');
  const user = await getAuthenticatedUser();

  const knownErrors = {
    failedToCreatePortalSession: t('failedToCreatePortalSession'),
    familyNotFound: t('familyNotFound'),
    notFamilyOwner: t('notFamilyOwner'),
    subscriptionNotFound: t('subscriptionNotFound')
  };

  try {
    const family = await getSelectedFamily();

    if (!family) {
      throw new Error(knownErrors.familyNotFound);
    }

    const subscription = await prisma.subscription.findUnique({
      where: { familyId: family.id }
    });

    if (family.ownerId !== user.id) {
      throw new Error(knownErrors.notFamilyOwner);
    }

    if (!subscription || !subscription?.stripeCustomerId) {
      throw new Error(knownErrors.subscriptionNotFound);
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      locale: language === 'pl' ? 'pl' : 'en',
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}${pathGenerators.settings()}`
    });

    return {
      success: true,
      data: { url: portalSession.url }
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
        : knownErrors.failedToCreatePortalSession
    };
  }
}
