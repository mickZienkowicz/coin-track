import { Suspense } from 'react';
import { getLocale, getTranslations } from 'next-intl/server';

import { Language } from '@/i18n/routing';
import { getCurrencyList } from '@/lib/currencies';
import { timezones } from '@/lib/dates/time-zones';
import { getFamilies } from '@/server/family/queries/get-families';
import { getSelectedFamilyId } from '@/server/family/queries/get-selected-family-id';
import { getReceivedInvitations } from '@/server/invitation/queries/get-received-invitations';
import { getSentInvitations } from '@/server/invitation/queries/get-sent-invitations';
import { getUser } from '@/server/user/queries/get-user';

import { LoadingCard } from '../(features)/_components/loading-card/loading-card';
import { AddFamilyDialog } from './_components/family-card/components/add-family/add-family-dialog';
import { FamilyCardsWrapper } from './_components/family-cards-warpper/family-cards-wrapper';
import { ReceivedInvitationsList } from './_components/received-invitations-list';
import { SentInvitationsList } from './_components/sent-invitations-list';

export default async function SettingsPage() {
  const [
    t,
    locale,
    user,
    families,
    receivedInvitations,
    sentInvitations,
    selectedFamilyId
  ] = await Promise.all([
    getTranslations('settings'),
    getLocale(),
    getUser(),
    getFamilies(),
    getReceivedInvitations(),
    getSentInvitations(),
    getSelectedFamilyId()
  ]);

  const currencies = getCurrencyList({
    language: locale as Language
  });

  return (
    <div className='@container space-y-6'>
      <div className='mr-14 flex items-center justify-between gap-4 lg:mr-0'>
        <h1 className='flex min-h-11 w-full items-center text-start text-3xl font-semibold'>
          {t('yourProfiles')}
        </h1>
        {families.length >= 1 && (
          <AddFamilyDialog
            className='@md:w-auto w-full'
            currencies={currencies}
            timezones={timezones}
            mobileSmallVersion
          />
        )}
      </div>

      <Suspense fallback={<LoadingCard className='mt-6' />}>
        <FamilyCardsWrapper
          families={families}
          currentUserId={user.id}
          selectedFamilyId={selectedFamilyId}
          currencies={currencies}
          timezones={timezones}
        />

        <ReceivedInvitationsList invitations={receivedInvitations} />

        <SentInvitationsList invitations={sentInvitations} />
      </Suspense>
    </div>
  );
}
