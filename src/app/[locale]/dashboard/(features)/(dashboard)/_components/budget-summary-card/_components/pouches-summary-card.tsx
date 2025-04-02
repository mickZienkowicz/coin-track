import { Package } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';

import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Language } from '@/i18n/routing';
import { formatCurrency } from '@/lib/currencies';
import { cn } from '@/lib/utils';

export const PouchesSummaryCard = async ({
  currency,
  pouchesOutcomesSum,
  pouchesSum,
  pouchesBalancePercentage,
  className
}: {
  currency: string;
  pouchesOutcomesSum: number;
  pouchesSum: number;
  pouchesBalancePercentage: number;
  className?: string;
}) => {
  const locale = await getLocale();
  const t = await getTranslations('dashboard.balance.pouch');

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className='flex flex-col md:gap-2'>
        <div className='flex items-start justify-between gap-2 md:items-center'>
          <div className='flex flex-col gap-2 md:flex-row md:items-center md:gap-4'>
            <h4 className='-mb-1 flex items-center gap-3 text-xl font-bold '>
              <span className='flex size-9  items-center justify-center rounded-full bg-blue-600/20'>
                <Package className='size-5 text-blue-600' />
              </span>
              {t('title')}
            </h4>
            <p className='flex items-center justify-between text-2xl font-black text-primary/85 md:text-[25px]'>
              {formatCurrency({
                cents: pouchesOutcomesSum,
                currency,
                language: locale as Language
              })}
            </p>
          </div>
          <Badge
            className={cn(
              'mt-[2px] bg-blue-600 font-bold tracking-tighter text-white md:mt-0',
              pouchesBalancePercentage >= 100 && 'bg-red-700'
            )}
          >
            {pouchesBalancePercentage.toFixed(0)}%
          </Badge>
        </div>

        <div className='mt-1 flex items-center justify-between gap-1'>
          <p className='text-sm text-primary/50'>
            {t('spent')}:{' '}
            <span className='font-bold'>
              {formatCurrency({
                cents: pouchesOutcomesSum,
                currency,
                language: locale as Language
              })}
            </span>
          </p>
          <p className='text-end text-sm text-primary/50'>
            {t('planned')}:{' '}
            <span className='font-bold'>
              {formatCurrency({
                cents: pouchesSum,
                currency,
                language: locale as Language
              })}
            </span>
          </p>
        </div>
      </div>

      {pouchesBalancePercentage >= 100 ? (
        <Progress
          value={(pouchesSum / pouchesOutcomesSum) * 100}
          className='bg-red-700'
          progressBarClassName='bg-blue-600'
        />
      ) : (
        <Progress
          value={pouchesBalancePercentage}
          progressBarClassName='bg-blue-600'
        />
      )}
    </div>
  );
};
