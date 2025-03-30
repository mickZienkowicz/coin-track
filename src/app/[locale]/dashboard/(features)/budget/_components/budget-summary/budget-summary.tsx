import { Calendar } from 'lucide-react';
import { useLocale } from 'next-intl';

import { Language } from '@/i18n/routing';
import { BudgetSummaryResponse } from '@/server/budget/types';

import { AddPouchOutcomeDialog } from '../pouch/add-pouch-outcome/add-pouch-outcome-dialog';
import { BudgetSummaryIncomeList } from './_components/budget-summary-income-list/budget-summary-income-list';
import { BudgetSummaryOutcomeList } from './_components/budget-summary-outcome-list';
import { BudgetSummaryPouchList } from './_components/budget-summary-pouch-list';
import { BalanceSummaryCard } from './_components/summary-cards/balance-summary-card';
import { IncomesSummaryCard } from './_components/summary-cards/incomes-summary-card';
import { OutcomesSummaryCard } from './_components/summary-cards/outcomes-summary-card';
import { PouchesSummaryCard } from './_components/summary-cards/pouches-summary-card';
import { getCurrentBudgetTimeframeLabel } from './_utils/get-current-budget-timeframe-label';

export const BudgetSummary = ({
  currency,
  budgetSummary
}: {
  currency: string;
  budgetSummary: BudgetSummaryResponse;
}) => {
  const locale = useLocale();

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
        <div className='flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-2 xl:justify-end'>
          <AddPouchOutcomeDialog
            currency={currency}
            pouches={budgetSummary.pouchOccurances}
          />
        </div>
      </div>
      <div className='mt-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
        <BalanceSummaryCard
          incomesSum={budgetSummary.incomesSum}
          outcomesSum={budgetSummary.outcomesSum}
          pouchesOutcomesSum={budgetSummary.pouchesOutcomesSum}
          balanceSum={budgetSummary.balance}
          balanceWithFullPouchesSum={budgetSummary.balanceWithFullPouchesSum}
          currency={currency}
        />
        <PouchesSummaryCard
          pouchesSum={budgetSummary.pouchesSum}
          pouchesOutcomesSum={budgetSummary.pouchesOutcomesSum}
          currency={currency}
        />

        <IncomesSummaryCard
          incomesSum={budgetSummary.incomesSum}
          currency={currency}
        />
        <OutcomesSummaryCard
          outcomesSum={budgetSummary.outcomesSum}
          currency={currency}
        />
      </div>
      <section className='mt-16 grid grid-cols-1 gap-6 2xl:grid-cols-3'>
        <BudgetSummaryPouchList
          currency={currency}
          pouches={budgetSummary.pouchOccurances}
        />
        <BudgetSummaryIncomeList
          currency={currency}
          incomesSum={budgetSummary.incomesSum}
          incomes={budgetSummary.incomeOccurances}
        />
        <BudgetSummaryOutcomeList
          currency={currency}
          outcomesSum={budgetSummary.outcomesSum}
          outcomes={budgetSummary.outcomeOccurances}
        />
      </section>
    </>
  );
};
