'use client';

import { useOptimistic } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Switch } from '@/components/ui/switch';

export const ShowPastItemsSwitch = ({
  shouldShowPastItems
}: {
  shouldShowPastItems: boolean;
}) => {
  const t = useTranslations('budget');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [optimisticShowPastItems, setOptimisticShowPastItems] = useOptimistic(
    shouldShowPastItems,
    (_, newValue: boolean) => newValue
  );

  const setShowPastItems = (checked: boolean) => {
    setOptimisticShowPastItems(checked);

    const params = new URLSearchParams(searchParams);

    if (checked) {
      params.set('showPastItems', 'true');
    } else {
      params.delete('showPastItems');
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className='flex w-fit items-center gap-2'>
      <Switch
        checked={optimisticShowPastItems}
        onCheckedChange={setShowPastItems}
      />
      <p className='text-nase w-max font-medium'>{t('showPastItems')}</p>
    </div>
  );
};
