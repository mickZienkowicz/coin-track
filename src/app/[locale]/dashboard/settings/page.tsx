import { useTranslations } from 'next-intl';

import { NoFamilyCardFallback } from '../_components/no-family-card-fallback';
import { AddFamilyDialog } from './_components/family-card/components/add-family/add-family-dialog';
import { FamilyCardsWrapper } from './_components/family-cards-warpper/family-cards-wrapper';
import { ReceivedInvitationsList } from './_components/received-invitations-list';
import { SentInvitationsList } from './_components/sent-invitations-list';

export default function SettingsPage() {
  const t = useTranslations('settings');

  return (
    <div className='@container space-y-6'>
      <div className='mr-14 flex items-center justify-between gap-4 lg:mr-0'>
        <h1 className='flex min-h-11 w-full items-center text-start text-3xl font-semibold'>
          {t('yourProfiles')}
        </h1>

        <AddFamilyDialog className='@md:w-auto w-full' mobileSmallVersion />
      </div>

      <NoFamilyCardFallback>
        <>
          <FamilyCardsWrapper />

          <ReceivedInvitationsList />

          <SentInvitationsList />
        </>
      </NoFamilyCardFallback>
    </div>
  );
}
