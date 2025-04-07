import { Suspense } from 'react';
import { ListOrdered, PieChart } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getBudget } from '@/server/budget/queries/get-budget';

import { LoadingCard } from '../../_components/loading-card/loading-card';
import { NoFamilyCardFallback } from '../../_components/no-family-card-fallback';
import { BudgetConfiguration } from './_components/budget-configuration';
import { BudgetSettingsDialog } from './_components/budget-settings/budget-settings-dialog/budget-settings-dialog';
import { BudgetSummary } from './_components/budget-summary/budget-summary';

export default async function BudgetPage() {
  const [t, budget] = await Promise.all([
    getTranslations('budget'),
    getBudget()
  ]);

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
        <Tabs defaultValue='summary' className='w-full gap-0'>
          <TabsList className='mt-6 w-full'>
            <TabsTrigger value='summary'>
              <PieChart className='h-4 w-4' />
              {t('summary')}
            </TabsTrigger>
            <TabsTrigger value='budget-items'>
              <ListOrdered className='h-4 w-4' />
              {t('budgetItems')}
            </TabsTrigger>
          </TabsList>
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
        </Tabs>
      </NoFamilyCardFallback>
    </div>
  );
}
