import { Package } from 'lucide-react';
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
import { PouchesSummaryCard } from './_components/pouches-summary-card';

export const BudgetSummaryCard = async ({
  className
}: {
  className?: string;
}) => {
  const [t, budgetSummary, locale] = await Promise.all([
    getTranslations('dashboard.balance'),
    getBudgetSummary(),
    getLocale()
  ]);

  if (budgetSummary === null) {
    return null;
  }

  return (
    <Card className={cn('gap-3', className)} data-tour='budget-balance-card'>
      <CardHeader className='pb-2'>
        <CardTitle className='flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between '>
          <div className='order-2 flex items-center gap-3 xl:order-1'>
            <div className='flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-600/20 md:size-11'>
              <Package className='size-5 text-blue-600 md:size-6' />
            </div>
            <div className='flex flex-col'>
              <h2 className='text-2xl font-bold'>
                {t('currentBudgetBalance')}
              </h2>
              <p className='text-sm font-normal text-primary/70'>
                {getCurrentBudgetTimeframeLabel({
                  startDate: budgetSummary.startDate,
                  finishDate: budgetSummary.endDate,
                  locale: locale as Language,
                  budgetInterval: budgetSummary.budget.interval
                })}
              </p>
            </div>
          </div>

          <BalanceBadge
            balanceSum={budgetSummary.balance}
            className='hidden xl:flex'
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid gap-8 xl:grid-cols-2 xl:gap-12'>
          <BalanceSummaryCard
            balanceSum={budgetSummary.balance}
            incomesSum={budgetSummary.incomesSum}
            outcomesSum={budgetSummary.outcomesSum}
            pouchesOutcomesSum={budgetSummary.pouchesOutcomesSum}
          />
          <PouchesSummaryCard
            pouchesOutcomesSum={budgetSummary.pouchesOutcomesSum}
            pouchesSum={budgetSummary.pouchesSum}
            pouchesBalancePercentage={
              budgetSummary.pouchesSum <= 0
                ? 0
                : (budgetSummary.pouchesOutcomesSum /
                    budgetSummary.pouchesSum) *
                  100
            }
          />
        </div>
        <div className='mt-4 flex justify-end'>
          <Link
            href={pathGenerators.budget()}
            className={cn(buttonVariants({ size: 'sm' }))}
            data-tour='manage-budget-button'
          >
            {t('manageBudget')}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
