'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import * as RechartsPrimitive from 'recharts';

import { FormattedCurrency } from '@/app/[locale]/(app)/dashboard/_components/formatted-currency/formatted-currency';
import { cn } from '@/lib/utils';

type Theme = { light: ''; dark: '.dark' };

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof Theme, string> }
  );
};

export const BudgetHistoryChartItemTooltip = ({
  active,
  payload,
  className,
  indicator = 'dot',
  label,
  color
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<'div'> & {
    indicator?: 'line' | 'dot' | 'dashed';
  }) => {
  const t = useTranslations('dashboard.history');

  if (!active || !payload?.length) {
    return null;
  }

  const nestLabel = payload.length === 1 && indicator !== 'dot';

  return (
    <div
      className={cn(
        'grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background p-4 text-xs shadow-xl',
        className
      )}
    >
      <div className='mb-2 flex w-full justify-center text-base font-medium'>
        {label}
      </div>
      <div className='grid gap-1.5'>
        {payload.map((item) => {
          const indicatorColor = color || item.payload.fill || item.color;

          return (
            <div
              key={item.dataKey}
              className={cn(
                'flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-primary/90',
                indicator === 'dot' && 'items-center'
              )}
            >
              <div
                className={cn(
                  'border-(--color-border) bg-(--color-bg) shrink-0 rounded-[2px]',
                  {
                    'h-2.5 w-2.5': indicator === 'dot',
                    'w-1': indicator === 'line',
                    'w-0 border-[1.5px] border-dashed bg-transparent':
                      indicator === 'dashed',
                    'my-0.5': nestLabel && indicator === 'dashed'
                  }
                )}
                style={
                  {
                    '--color-bg': indicatorColor,
                    '--color-border': indicatorColor
                  } as React.CSSProperties
                }
              />
              <div className='flex flex-1 justify-between gap-2'>
                <div>
                  <span className='text-sm text-primary/80'>
                    {item.name === 'incomes' && t('incomes')}
                    {item.name === 'outcomes' && t('outcomes')}
                    {item.name === 'balance' && t('balance')}
                  </span>
                </div>
                {item.value && (
                  <span className='text-sm font-medium text-primary'>
                    <FormattedCurrency valueCents={item.value as number} />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
