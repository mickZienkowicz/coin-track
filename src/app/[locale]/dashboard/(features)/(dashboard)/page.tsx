'use server';

import { getTranslations } from 'next-intl/server';

import { NoFamilyCardFallback } from '../../_components/no-family-card-fallback';
import { BudgetHistoryCard } from './_components/budget-history-card/budget-history-card';
import { BudgetSummaryCard } from './_components/budget-summary-card';
import { FinancialCushionCard } from './_components/financial-cushion-card';
import { FortuneSummaryCard } from './_components/fortune-summary-card/fortune-summary-card';
import { GoalsSummaryCard } from './_components/goals-summary-card/goals-summary-card';

export default async function Dashboard() {
  const t = await getTranslations('dashboard');

  return (
    <div className='@container'>
      <div className='@xl:flex-row flex flex-col items-center justify-between gap-4 2xl:mt-2'>
        <div className='@xl:flex-row @xl:items-center @xl:justify-start flex w-full flex-col gap-6'>
          <h1 className='@xl:w-auto mr-14 flex min-h-11 items-center text-start text-3xl font-semibold lg:mr-0'>
            {t('title')}
          </h1>
        </div>
      </div>

      <NoFamilyCardFallback>
        <div className='mt-6 flex flex-col gap-6'>
          <FortuneSummaryCard />
          <BudgetSummaryCard className='-order-1 md:order-none' />
          <BudgetHistoryCard />
          <div className='grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1.5fr]'>
            <GoalsSummaryCard />
            <div>
              <FinancialCushionCard />
            </div>
          </div>
        </div>
      </NoFamilyCardFallback>
    </div>
  );
}
