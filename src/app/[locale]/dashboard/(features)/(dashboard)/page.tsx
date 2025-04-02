import { getTranslations } from 'next-intl/server';

import { getSelectedFamily } from '@/server/family/queries/get-selected-family';

import { NoFamilyCard } from '../../_components/no-family-card';
import { BudgetSummaryCard } from './_components/budget-summary-card';
import { FinancialCushionCard } from './_components/financial-cushion-card';
import { FortuneSection } from './_components/fortune-section';
import { GoalsSummaryCard } from './_components/goals-summary-card/goals-summary-card';

export default async function Dashboard() {
  const t = await getTranslations('dashboard');
  const family = await getSelectedFamily();

  return (
    <div className='@container'>
      <div className='@xl:flex-row flex flex-col items-center justify-between gap-4 2xl:mt-2'>
        <div className='@xl:flex-row flex w-full flex-col items-center justify-start gap-6'>
          <h1 className='@xl:w-auto w-full text-start text-3xl font-semibold'>
            {t('title')}
          </h1>
        </div>
      </div>

      {family ? (
        <div className='flex flex-col gap-6'>
          <FortuneSection currency={family.currency} />
          <BudgetSummaryCard currency={family.currency} />
          <div className='grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]'>
            <FinancialCushionCard currency={family.currency} />
            <GoalsSummaryCard />
          </div>
        </div>
      ) : (
        <NoFamilyCard />
      )}
    </div>
  );
}
