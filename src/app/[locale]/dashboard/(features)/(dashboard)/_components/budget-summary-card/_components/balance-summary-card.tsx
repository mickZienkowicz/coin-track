import { Wallet } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';

import { Progress } from '@/components/ui/progress';
import { Language } from '@/i18n/routing';
import { formatCurrency } from '@/lib/currencies';
import { cn } from '@/lib/utils';

export const BalanceSummaryCard = async ({
  balanceSum,
  currency,
  incomesSum,
  outcomesSum,
  pouchesOutcomesSum,
  className
}: {
  balanceSum: number;
  currency: string;
  incomesSum: number;
  outcomesSum: number;
  pouchesOutcomesSum: number;
  className?: string;
}) => {
  const t = await getTranslations('dashboard.balance.balance');
  const locale = await getLocale();
  return (
    <div className={cn('@container flex flex-col gap-2', className)}>
      <div className='flex flex-col md:gap-2'>
        <div className='flex flex-col gap-2 md:flex-row md:items-center md:gap-4'>
          <h4 className='-mb-1 flex items-center gap-3 text-xl font-bold'>
            <span className='flex size-9  items-center justify-center rounded-full bg-yellow-600/20'>
              <Wallet className='size-[18px] text-yellow-600' />
            </span>
            {t('title')}
          </h4>
          <p
            className={cn(
              '@sm:flex-row @sm:items-center flex flex-col justify-between text-2xl font-black  md:text-[25px]',
              balanceSum === 0 && 'text-yellow-600',
              balanceSum > 0 && 'text-green-600',
              balanceSum < 0 && 'text-red-700'
            )}
          >
            {formatCurrency({
              cents: balanceSum,
              currency,
              language: locale as Language
            })}
          </p>
        </div>
        <div className='mt-1 flex items-center justify-between gap-1'>
          <p className='text-sm text-primary/50'>
            {t('income')}:{' '}
            <span className='font-bold'>
              {formatCurrency({
                cents: incomesSum,
                currency,
                language: locale as Language
              })}
            </span>
          </p>
          <p className='text-end text-sm text-primary/50'>
            {t('outcome')}:{' '}
            <span className='font-bold'>
              {formatCurrency({
                cents: outcomesSum + pouchesOutcomesSum,
                currency,
                language: locale as Language
              })}
            </span>{' '}
            <span className='hidden text-xs 2xl:inline-block'>
              {t('withPouches')}
            </span>
          </p>
        </div>
      </div>
      <Progress
        value={
          ((outcomesSum + pouchesOutcomesSum) /
            (outcomesSum + pouchesOutcomesSum + incomesSum)) *
          100
        }
        progressBarClassName='bg-red-700'
        className='bg-green-600'
      />
    </div>
  );
};
