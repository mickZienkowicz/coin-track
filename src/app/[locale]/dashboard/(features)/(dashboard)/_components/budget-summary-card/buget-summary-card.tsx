import { Wallet } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';

import { BalanceBadge } from '@/app/[locale]/dashboard/_components/balance-badge/balance-badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/i18n/navigation';
import { Language } from '@/i18n/routing';
import { pathGenerators } from '@/lib/paths';
import { cn } from '@/lib/utils';
import { getBudgetSummary } from '@/server/budget/queries/get-budget-summary';

import { getCurrentBudgetTimeframeLabel } from '../../../budget/_components/budget-summary/_utils/get-current-budget-timeframe-label';
import { BalanceSummaryCard } from './_components/balance-summary-card';
import { IncomeSummaryCard } from './_components/income-summary-card';
import { OutcomeSummaryCard } from './_components/outcome-summary-card';
import { PouchesSummaryCard } from './_components/pouches-summary-card';

export const BudgetSummaryCard = async ({ currency }: { currency: string }) => {
  const t = await getTranslations('dashboard.balance');
  const budgetSummary = await getBudgetSummary();
  const locale = await getLocale();

  if (budgetSummary === null) {
    return null;
  }

  const incomesSum = budgetSummary.incomesSum;
  const outcomesSum = budgetSummary.outcomesSum;
  const pouchesOutcomesSum = budgetSummary.pouchesOutcomesSum;
  const balanceSum = budgetSummary.balance;
  const pouchesSum = budgetSummary.pouchesSum;
  const pouchesBalancePercentage =
    (pouchesSum <= 0 ? 0 : pouchesOutcomesSum / pouchesSum) * 100;

  return (
    <Card>
      <CardHeader className='pb-2'>
        <CardTitle className='flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between '>
          <div className='order-2 flex items-center gap-3 xl:order-1'>
            <div className='flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-600/20 md:size-11'>
              <Wallet className='size-5 text-blue-600 md:size-6' />
            </div>
            <div className='flex flex-col'>
              <h2 className='text-2xl font-bold'>
                {t('currentBudgetBalance')}
              </h2>
              <p className='text-sm text-primary/50'>
                {getCurrentBudgetTimeframeLabel({
                  startDate: budgetSummary.startDate,
                  finishDate: budgetSummary.endDate,
                  locale: locale as Language
                })}
              </p>
            </div>
          </div>

          <BalanceBadge balanceSum={balanceSum} className='hidden xl:flex' />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid gap-8 xl:grid-cols-2 xl:gap-10 xl:gap-y-8'>
          <IncomeSummaryCard currency={currency} incomesSum={incomesSum} />
          <OutcomeSummaryCard currency={currency} outcomesSum={outcomesSum} />
          <PouchesSummaryCard
            currency={currency}
            pouchesOutcomesSum={pouchesOutcomesSum}
            pouchesSum={pouchesSum}
            pouchesBalancePercentage={pouchesBalancePercentage}
            className='-order-1 xl:order-1'
          />
          <BalanceSummaryCard
            currency={currency}
            balanceSum={balanceSum}
            incomesSum={incomesSum}
            outcomesSum={outcomesSum}
            pouchesOutcomesSum={pouchesOutcomesSum}
            className='-order-2 xl:order-1'
          />
        </div>
        <div className='mt-4 flex justify-end'>
          <Link href={pathGenerators.budget()} className={cn(buttonVariants())}>
            {t('manageBudget')}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
