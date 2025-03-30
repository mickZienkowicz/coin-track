'use client';

import { useOptimistic } from 'react';
import { PlusCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Card, CardContent } from '@/components/ui/card';
import type { FamilyWithUsers } from '@/server/family/queries/get-families';

import { AddFamilyDialog } from '../family-card/components/add-family/add-family-dialog';
import { FamilyCard } from '../family-card/family-card';

type FamilyCardProps = {
  families: FamilyWithUsers[];
  currentUserId: string;
  selectedFamilyId: string | undefined;
  currencies: {
    label: string;
    value: string;
  }[];
  timezones: {
    label: string;
    value: string;
  }[];
};

export const FamilyCardsWrapper = ({
  families,
  currentUserId,
  selectedFamilyId,
  currencies,
  timezones
}: FamilyCardProps) => {
  const t = useTranslations('settings');
  const [optimisticSelectedFamilyId, setOptimisticSelectedFamilyId] =
    useOptimistic<string | undefined>(selectedFamilyId);

  if (families.length === 0) {
    return (
      <Card className='w-full'>
        <CardContent className='flex flex-col items-center px-8 pb-6 pt-10 text-center'>
          <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted'>
            <PlusCircle className='h-8 w-8 text-muted-foreground' />
          </div>
          <h2 className='mb-3 text-2xl font-semibold'>
            {t('noProfilesCardTitle')}
          </h2>
          <p className='mb-6 max-w-xl text-muted-foreground'>
            {t('noProfilesCardDescription')}
          </p>
          <AddFamilyDialog currencies={currencies} timezones={timezones} />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='@7xl:grid-cols-3 @2xl:grid-cols-2 grid grid-cols-1 gap-8'>
      {families.map((family) => (
        <FamilyCard
          key={family.id}
          family={family}
          currencies={currencies}
          timezones={timezones}
          currentUserId={currentUserId}
          selectedFamilyId={optimisticSelectedFamilyId}
          setOptimisticSelectedFamilyId={setOptimisticSelectedFamilyId}
        />
      ))}
    </div>
  );
};
