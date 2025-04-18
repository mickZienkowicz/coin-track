'use client';

import { useMemo } from 'react';
import { format, isBefore, isSameDay } from 'date-fns';
import { useTranslations } from 'next-intl';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { buttonVariants } from '@/components/ui/button';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip
} from '@/components/ui/chart';
import { Link } from '@/i18n/navigation';
import { pathGenerators } from '@/lib/paths';

import { BudgetHistoryChartItemTooltip } from './budget-history-chart-item-tooltip';

export const BudgetHistoryChart = ({
  chartData,
  budgetsHistory
}: {
  chartData: {
    period: string;
    incomes: number;
    outcomes: number;
    balance: number;
  }[];
  budgetsHistory: { startDate: Date; endDate: Date }[] | null;
}) => {
  const t = useTranslations('dashboard.history');

  const chartConfig = useMemo(
    () =>
      ({
        incomes: {
          label: t('incomes'),
          color: '#008236'
        },
        outcomes: {
          label: t('outcomes'),
          color: '#AF0000'
        },
        balance: {
          label: t('balance'),
          color: '#155CFC'
        }
      }) satisfies ChartConfig,
    [t]
  );

  return (
    <>
      <ChartContainer
        config={chartConfig}
        className='mx-auto h-[220px] w-full border-none'
        style={{ width: `${chartData?.length * 160}px` }}
      >
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey='period'
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip content={<BudgetHistoryChartItemTooltip />} />
          <Bar dataKey='incomes' fill='var(--color-incomes)' radius={4} />
          <Bar dataKey='outcomes' fill='var(--color-outcomes)' radius={4} />
          <Bar dataKey='balance' fill='var(--color-balance)' radius={4} />
        </BarChart>
      </ChartContainer>
      <div className='mx-auto mb-2 mt-1 flex flex-row-reverse justify-center'>
        {budgetsHistory?.map((item) => (
          <div
            className='flex w-[160px] items-center justify-center'
            key={item.endDate.toISOString()}
          >
            <Link
              href={
                isBefore(new Date(), item.endDate) ||
                isSameDay(new Date(), item.endDate)
                  ? pathGenerators.budget()
                  : pathGenerators.budgetFromDate(
                      format(item.endDate, 'yyyy-MM-dd')
                    )
              }
              className={buttonVariants({
                size: 'sm',
                variant: 'outline'
              })}
              aria-label={`${t('seePreview')} ${item.startDate.toLocaleDateString()} ${t('to')} ${item.endDate.toLocaleDateString()}`}
            >
              {t('seePreview')}
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};
