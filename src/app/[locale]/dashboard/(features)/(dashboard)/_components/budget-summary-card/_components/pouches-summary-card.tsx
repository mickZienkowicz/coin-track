import { ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { FormattedCurrency } from '@/app/[locale]/dashboard/_components/formatted-currency/formatted-currency';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export const PouchesSummaryCard = ({
  pouchesOutcomesSum,
  pouchesSum,
  pouchesBalancePercentage,
  className
}: {
  pouchesOutcomesSum: number;
  pouchesSum: number;
  pouchesBalancePercentage: number;
  className?: string;
}) => {
  const t = useTranslations('dashboard.balance.pouch');

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className='flex flex-col gap-3'>
        <div className='flex flex-col gap-3.5'>
          <div className='flex w-full justify-between gap-2'>
            <h4 className='flex items-center gap-2 text-xl font-bold md:gap-3'>
              <span className='flex size-7 items-center  justify-center rounded-full bg-blue-600/20 md:size-9'>
                <ShoppingCart className='size-4 text-blue-600 md:size-5' />
              </span>
              {t('title')}
            </h4>
            <Badge
              className={cn(
                'mt-[2px] bg-blue-600 font-bold tracking-tighter text-white md:mt-0',
                pouchesBalancePercentage >= 100 && 'bg-red-700'
              )}
            >
              {pouchesBalancePercentage.toFixed(0)}%
            </Badge>
          </div>
        </div>

        <div className='mt-1 flex min-h-5 items-center justify-between gap-1'>
          <p className='flex flex-col items-start gap-1 text-sm text-primary/70 sm:flex-row sm:items-center'>
            {t('spent')}:
            <span className='font-bold'>
              <FormattedCurrency valueCents={pouchesOutcomesSum} />
            </span>
          </p>
          <p className='flex flex-col items-end gap-1 text-sm text-primary/70 sm:flex-row sm:items-center'>
            {t('planned')}:
            <span className='font-bold'>
              <FormattedCurrency valueCents={pouchesSum} />
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
