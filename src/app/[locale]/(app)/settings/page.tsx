import { getTranslations } from 'next-intl/server';

import { getSelectedFamily } from '@/server/family/queries/get-selected-family';
import { getSubscription } from '@/server/subscription/queries/get-subscription';

import { StartTourButton } from '../_components/start-tour-button';
import { NoFamilyCardFallback } from '../dashboard/_components/no-family-card-fallback';
import { AddFamilyDialog } from './_components/family-card/components/add-family/add-family-dialog';
import { FamilyCardsWrapper } from './_components/family-cards-warpper/family-cards-wrapper';
import { ReceivedInvitationsList } from './_components/received-invitations-list';
import { SentInvitationsList } from './_components/sent-invitations-list';
import { SubscriptionManager } from './_components/subscription/subscription-manager';

export default async function SettingsPage() {
  const [t, subscription, family] = await Promise.all([
    getTranslations('settings'),
    getSubscription(),
    getSelectedFamily()
  ]);

  return (
    <div className='@container space-y-6'>
      <div className='mr-14 flex items-center justify-between gap-4 lg:mr-0'>
        <h1 className='flex min-h-11 w-full items-center text-start text-3xl font-semibold'>
          {t('yourProfiles')}
        </h1>

        <div className='flex gap-2'>
          <AddFamilyDialog className='@md:w-auto w-full' mobileSmallVersion />
          <StartTourButton className='hidden md:flex' />
        </div>
      </div>

      <div className='flex justify-end md:hidden'>
        <StartTourButton />
      </div>

      <NoFamilyCardFallback>
        <>
          <FamilyCardsWrapper />

          {family && (
            <SubscriptionManager
              subscriptionData={subscription}
              family={family}
            />
          )}

          <div className='grid grid-cols-1 gap-8 2xl:grid-cols-2'>
            <ReceivedInvitationsList />

            <SentInvitationsList />
          </div>
        </>
      </NoFamilyCardFallback>
    </div>
  );
}
