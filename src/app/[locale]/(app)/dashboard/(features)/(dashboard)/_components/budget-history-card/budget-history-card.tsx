'use server';

import { Calendar } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Language } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { getBudgetsHistory } from '@/server/budget/queries/get-budgets-history';

import { getCurrentBudgetTimeframeLabel } from '../../../budget/_components/budget-summary/_utils/get-current-budget-timeframe-label';
import { SelectBudgetToPreviewDialog } from '../select-budget-to-preview-dialog';
import { BudgetHistoryChart } from './_components/budget-history-chart';
import { BudgetHistoryChartLegend } from './_components/budget-history-chart-legend';

export const BudgetHistoryCard = async () => {
  const [t, locale, budgetsHistory] = await Promise.all([
    getTranslations('dashboard.history'),
    getLocale(),
    getBudgetsHistory()
  ]);

  const chartData = budgetsHistory?.map((budget) => ({
    period: `${getCurrentBudgetTimeframeLabel({
      startDate: budget.startDate,
      finishDate: budget.endDate,
      locale: locale as Language,
      budgetInterval: budget.interval
    })}`,
    incomes: budget.incomes,
    outcomes: budget.outcomes,
    balance: budget.balance
  }));

  return (
    <Card className={cn('gap-3')} data-tour='history-of-finances-card'>
      <CardHeader className='pb-2'>
        <CardTitle className='flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between '>
          <div className='order-2 flex items-center gap-3 xl:order-1'>
            <div className='flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-600/20 md:size-11'>
              <Calendar className='size-5 text-blue-600 md:size-6' />
            </div>
            <div className='flex flex-col'>
              <h2 className='text-2xl font-bold'>{t('title')}</h2>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className='px-0 lg:px-0'>
        <ScrollArea
          type='always'
          dir='rtl'
          className='rounded-m w-full whitespace-nowrap pb-4'
        >
          <ScrollBar orientation='horizontal' className='pl-2 pr-4 lg:pr-5' />
          <div className='px-2' dir='ltr'>
            <BudgetHistoryChart
              chartData={chartData ?? []}
              budgetsHistory={budgetsHistory}
            />
          </div>
        </ScrollArea>
        <BudgetHistoryChartLegend />
        <div className='mt-1 flex justify-end px-4 lg:px-6'>
          <SelectBudgetToPreviewDialog
            options={(budgetsHistory ?? [])?.map((budget) => ({
              id: budget.endDate.toISOString(),
              label: `${getCurrentBudgetTimeframeLabel({
                startDate: budget.startDate,
                finishDate: budget.endDate,
                locale: locale as Language,
                budgetInterval: budget.interval
              })}`,
              date: budget.endDate
            }))}
          />
        </div>
      </CardContent>
    </Card>
  );
};
