'use client';

import { ReactNode } from 'react';
import { ListOrdered, PieChart } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { AdditionalInfoTooltip } from '@/components/additional-info-tooltip';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from '@/i18n/navigation';
import { pathGenerators } from '@/lib/paths';

export const BudgetTabs = ({
  activeTab,
  children
}: {
  activeTab: string;
  children: ReactNode;
}) => {
  const router = useRouter();
  const t = useTranslations('budget');

  return (
    <Tabs defaultValue={activeTab} className='w-full gap-0' value={activeTab}>
      <TabsList className='mt-6 w-full'>
        <TabsTrigger
          value='summary'
          data-tour='budget-summary-tab'
          onClick={() => {
            router.replace(`${pathGenerators.budget()}?tab=summary`);
          }}
        >
          <PieChart className='size-4' />
          {t('summary')}
          <AdditionalInfoTooltip
            text={t('summaryAdditionalInfo')}
            className='ml-1'
          />
        </TabsTrigger>
        <TabsTrigger
          value='budget-items'
          data-tour='budget-items-tab'
          onClick={() => {
            router.replace(`${pathGenerators.budget()}?tab=budget-items`);
          }}
        >
          <ListOrdered className='h-4 w-4' />
          {t('budgetItems')}
          <AdditionalInfoTooltip
            text={t('budgetItemsAdditionalInfo')}
            className='ml-1'
          />
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};
