import { ArrowDownCircle, ArrowUpCircle, PieChart } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { FormattedCurrency } from '@/app/[locale]/(app)/dashboard/_components/formatted-currency/formatted-currency';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export const BalanceSummaryCard = ({
  balanceSum,
  incomesSum,
  outcomesSum,
  pouchesOutcomesSum,
  className
}: {
  balanceSum: number;
  incomesSum: number;
  outcomesSum: number;
  pouchesOutcomesSum: number;
  className?: string;
}) => {
  const t = useTranslations('dashboard.balance');

  return (
    <div className={cn('@container flex flex-col gap-2', className)}>
      <div className='flex flex-col gap-3'>
        <div className='flex flex-col gap-3.5'>
          <div className='flex w-full justify-between gap-2'>
            <h4 className='flex items-center gap-2 text-xl font-bold md:gap-3'>
              <span className='flex size-7 items-center justify-center rounded-full bg-yellow-600/20 md:size-9'>
                <PieChart className='size-3.5 text-yellow-600 md:size-5' />
              </span>
              {t('balance.title')}
            </h4>
            <Badge
              className={cn(
                'mt-[2px] h-8 bg-blue-600 font-bold tracking-tighter text-white md:mt-0',
                balanceSum < 0 && 'bg-red-700',
                balanceSum === 0 && 'bg-yellow-700',
                balanceSum > 0 && 'bg-green-700'
              )}
            >
              {balanceSum > 0 && '+'}
              <FormattedCurrency valueCents={balanceSum} />
            </Badge>
          </div>
        </div>
        <div className='mt-1 flex items-center justify-between gap-1'>
          <p className='flex flex-col items-center gap-1 text-sm text-primary/70 sm:flex-row'>
            <span className='flex items-center gap-1'>
              <span className='flex size-5  items-center justify-center rounded-full bg-red-700/20'>
                <ArrowDownCircle className='size-3.5 text-red-700' />
              </span>
              {t('balance.outcome')}:{' '}
            </span>
            <span className='font-bold'>
              <FormattedCurrency
                valueCents={outcomesSum + pouchesOutcomesSum}
              />
            </span>
            <span className='hidden text-xs 2xl:inline-block'>
              {' '}
              {t('balance.withPouches')}
            </span>
          </p>
          <p className='flex flex-col items-end gap-1 text-sm text-primary/70 sm:flex-row sm:items-center'>
            <span className='flex items-center gap-1'>
              <span className='flex size-5  items-center justify-center rounded-full bg-green-600/20'>
                <ArrowUpCircle className='size-3.5 text-green-600' />
              </span>
              {t('balance.income')}:{' '}
            </span>
            <span className='font-bold'>
              <FormattedCurrency valueCents={incomesSum} />
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
