'use client';

import { useMemo } from 'react';
import type { Family, Subscription } from '@prisma/client';
import { useTranslations } from 'next-intl';

import { ActiveSubscriptionCard } from './components/active-subscryption-card';
import { ChooseSubscriptionDialog } from './components/choose-subscription-dialog';
import { FreeAccountCard } from './components/free-account-card';
import { NoActiveSubscriptionCard } from './components/no-active-subscryption-card';
import { TrialCard } from './components/trial-card';
import { useShouldShowSubscriptionModal } from './hooks/use-should-show-subscription-modal';

interface SubscriptionManagerProps {
  subscriptionData: {
    subscription: Subscription | undefined;
    isInTrial: boolean;
    trialEndsAt: Date | null;
  };
  family: Family;
}

export function SubscriptionManager({
  subscriptionData,
  family
}: SubscriptionManagerProps) {
  const { subscription, isInTrial, trialEndsAt } = subscriptionData;
  const t = useTranslations('subscription');
  const shouldShowSubscriptionModal = useShouldShowSubscriptionModal();

  const subscriptionCard = useMemo(() => {
    if (family.hasFreeAccount) {
      return <FreeAccountCard />;
    }

    if (isInTrial && trialEndsAt && !subscription) {
      return <TrialCard trialEndsAt={trialEndsAt} currency={family.currency} />;
    }

    if (subscription) {
      return (
        <ActiveSubscriptionCard
          subscription={subscription}
          currency={family.currency}
        />
      );
    }

    return <NoActiveSubscriptionCard currency={family.currency} />;
  }, [
    family.hasFreeAccount,
    isInTrial,
    trialEndsAt,
    subscription,
    family.currency
  ]);

  return (
    <div className='mt-16'>
      <h2 className='mb-6 text-2xl font-semibold'>
        {t('title', { familyName: family.name })}
      </h2>

      {subscriptionCard}

      <ChooseSubscriptionDialog
        currency={family.currency}
        defaultOpen={shouldShowSubscriptionModal}
        hideTrigger={true}
      />
    </div>
  );
}
