'use server';

import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';

import { TabsContent } from '@/components/ui/tabs';
import { getBudget } from '@/server/budget/queries/get-budget';

import { LoadingCard } from '../../_components/loading-card/loading-card';
import { NoFamilyCardFallback } from '../../_components/no-family-card-fallback';
import { BudgetConfiguration } from './_components/budget-configuration';
import { BudgetSettingsDialog } from './_components/budget-settings/budget-settings-dialog/budget-settings-dialog';
import { BudgetSummary } from './_components/budget-summary/budget-summary';
import { BudgetTabs } from './_components/budget-tabs';

export default async function BudgetPage({
  searchParams
}: {
  searchParams: Promise<{ tab?: string | undefined }>;
}) {
  const [t, budget] = await Promise.all([
    getTranslations('budget'),
    getBudget()
  ]);

  const activeTab = (await searchParams)?.tab || 'summary';

  return (
    <div>
      <div className='@container relative mr-14 flex items-center justify-between gap-4 lg:mr-0 2xl:mt-2'>
        <div className='@xl:flex-row flex flex-col items-center justify-start gap-6'>
          <h1 className='@xl:w-auto flex min-h-11 w-full items-center text-start text-3xl font-semibold'>
            {t('title')}
          </h1>
        </div>
        {budget && (
          <BudgetSettingsDialog
            budget={budget}
            className='absolute right-0 top-0'
          />
        )}
      </div>

      <NoFamilyCardFallback>
        <BudgetTabs activeTab={activeTab}>
          <TabsContent value='summary'>
            <Suspense fallback={<LoadingCard className='mt-6' />}>
              <BudgetSummary />
            </Suspense>
          </TabsContent>
          <TabsContent value='budget-items'>
            <Suspense fallback={<LoadingCard className='mt-6' />}>
              <BudgetConfiguration />
            </Suspense>
          </TabsContent>
        </BudgetTabs>
      </NoFamilyCardFallback>
    </div>
  );
}
