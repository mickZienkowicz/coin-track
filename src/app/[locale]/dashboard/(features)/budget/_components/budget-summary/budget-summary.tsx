import { Calendar } from 'lucide-react';
import { getLocale } from 'next-intl/server';

import { Language } from '@/i18n/routing';
import { getBudgetSummary } from '@/server/budget/queries/get-budget-summary';

import { BudgetSummaryBadge } from '../budget-summary-badge/budget-summary-badge';
import { BudgetSummaryIncomeList } from './_components/budget-summary-income-list/budget-summary-income-list';
import { BudgetSummaryOutcomeList } from './_components/budget-summary-outcome-list';
import { BudgetSummaryPouchList } from './_components/budget-summary-pouch-list';
import { BalanceSummaryCard } from './_components/summary-cards/balance-summary-card';
import { IncomesSummaryCard } from './_components/summary-cards/incomes-summary-card';
import { OutcomesSummaryCard } from './_components/summary-cards/outcomes-summary-card';
import { PouchesSummaryCard } from './_components/summary-cards/pouches-summary-card';
import { getCurrentBudgetTimeframeLabel } from './_utils/get-current-budget-timeframe-label';

export const BudgetSummary = async () => {
  const [locale, budgetSummary] = await Promise.all([
    getLocale(),
    getBudgetSummary()
  ]);

  if (!budgetSummary) {
    return null;
  }

  return (
    <>
      <div className='my-6 flex flex-col justify-between gap-4 xl:flex-row xl:items-center'>
        <div className='flex items-center justify-start'>
          <Calendar className='mr-3 size-6 shrink-0' />
          <h2 className='text-2xl font-bold'>
            {getCurrentBudgetTimeframeLabel({
              startDate: budgetSummary.startDate,
              finishDate: budgetSummary.endDate,
              locale: locale as Language
            })}
          </h2>
        </div>
        <BudgetSummaryBadge
          balance={budgetSummary.balance}
          className='hidden lg:flex'
        />
      </div>
      <div className='mt-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
        <BalanceSummaryCard
          incomesSum={budgetSummary.incomesSum}
          outcomesSum={budgetSummary.outcomesSum}
          pouchesOutcomesSum={budgetSummary.pouchesOutcomesSum}
          balanceSum={budgetSummary.balance}
          balanceWithFullPouchesSum={budgetSummary.balanceWithFullPouchesSum}
        />
        <PouchesSummaryCard
          pouchesSum={budgetSummary.pouchesSum}
          pouchesOutcomesSum={budgetSummary.pouchesOutcomesSum}
        />

        <IncomesSummaryCard incomesSum={budgetSummary.incomesSum} />
        <OutcomesSummaryCard outcomesSum={budgetSummary.outcomesSum} />
      </div>
      <section className='mt-16 grid grid-cols-1 gap-6 2xl:grid-cols-3'>
        <BudgetSummaryPouchList pouches={budgetSummary.pouchOccurances} />
        <BudgetSummaryIncomeList
          incomesSum={budgetSummary.incomesSum}
          incomes={budgetSummary.incomeOccurances}
        />
        <BudgetSummaryOutcomeList
          outcomesSum={budgetSummary.outcomesSum}
          outcomes={budgetSummary.outcomeOccurances}
        />
      </section>
    </>
  );
};
