import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';

import { getSelectedFamily } from '@/server/family/queries/get-selected-family';

import { LoadingCard } from '../_components/loading-card/loading-card';
import { NoFamilyCard } from '../../_components/no-family-card';
import { BudgetSummaryCard } from './_components/budget-summary-card';
import { FinancialCushionCard } from './_components/financial-cushion-card';
import { FortuneSection } from './_components/fortune-section';
import { GoalsSummaryCard } from './_components/goals-summary-card/goals-summary-card';

export default async function Dashboard() {
  const [t, family] = await Promise.all([
    getTranslations('dashboard'),
    getSelectedFamily()
  ]);

  return (
    <div className='@container'>
      <div className='@xl:flex-row flex flex-col items-center justify-between gap-4 2xl:mt-2'>
        <div className='@xl:flex-row @xl:items-center @xl:justify-start flex w-full flex-col gap-6'>
          <h1 className='@xl:w-auto mr-14 flex min-h-11 items-center text-start text-3xl font-semibold lg:mr-0'>
            {t('title')}
          </h1>
        </div>
      </div>

      <Suspense fallback={<LoadingCard className='mt-6' />}>
        {!family ? (
          <NoFamilyCard />
        ) : (
          <div className='mt-6 flex flex-col gap-6'>
            <FortuneSection currency={family.currency} className='' />
            <BudgetSummaryCard
              currency={family.currency}
              className='-order-1 md:order-none'
            />
            <div className='grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1.5fr]'>
              <GoalsSummaryCard />
              <FinancialCushionCard currency={family.currency} />
            </div>
          </div>
        )}
      </Suspense>
    </div>
  );
}
