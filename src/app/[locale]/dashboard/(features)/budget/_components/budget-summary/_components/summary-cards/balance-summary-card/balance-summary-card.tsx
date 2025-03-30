import {
  ArrowDownCircle,
  ArrowUpCircle,
  CircleEqual,
  Wallet
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Language } from '@/i18n/routing';
import { formatCurrency } from '@/lib/currencies';
import { cn } from '@/lib/utils';

export const BalanceSummaryCard = ({
  incomesSum,
  outcomesSum,
  pouchesOutcomesSum,
  currency,
  balanceSum,
  balanceWithFullPouchesSum
}: {
  currency: string;
  incomesSum: number;
  outcomesSum: number;
  pouchesOutcomesSum: number;
  balanceSum: number;
  balanceWithFullPouchesSum: number;
}) => {
  const t = useTranslations('budgetSummary');
  const locale = useLocale();

  return (
    <Card className='justify-between gap-2'>
      <CardHeader className='flex items-center justify-between gap-2'>
        <CardTitle className='text-[26px]'>{t('balance')}</CardTitle>
        <div className='flex size-11  items-center justify-center rounded-full bg-yellow-600/20'>
          <Wallet className='size-6 text-yellow-600' />
        </div>
      </CardHeader>
      <CardContent className='@container flex flex-col gap-2'>
        <h4 className='flex flex-col'>
          <span
            className={cn(
              '@sm:flex-row @sm:items-center flex flex-col justify-between text-[26px] font-bold text-primary/90'
            )}
          >
            {formatCurrency({
              cents: balanceSum,
              currency,
              language: locale as Language
            })}
            <Badge
              className={cn(
                '@sm:order-1 @sm:mb-0 -order-1 mb-2 bg-yellow-700 font-bold tracking-tighter text-white',
                balanceSum > 0 && 'bg-green-700 text-white',
                balanceSum < 0 && 'bg-red-800 text-white'
              )}
            >
              {balanceSum > 0 && (
                <>
                  {t('positiveBalance')}
                  <ArrowUpCircle className='size-4! text-white' />
                </>
              )}
              {balanceSum < 0 && (
                <>
                  {t('negativeBalance')}
                  <ArrowDownCircle className='size-4! text-white' />
                </>
              )}
              {balanceSum === 0 && (
                <>
                  {t('neutralBalance')}
                  <CircleEqual className='size-4! text-white' />
                </>
              )}
            </Badge>
          </span>
          <span className='text-sm text-primary/50'>
            {t('currentBudgetBalance')}
          </span>
        </h4>
        <Progress
          value={
            ((outcomesSum + pouchesOutcomesSum) /
              (outcomesSum + pouchesOutcomesSum + incomesSum)) *
            100
          }
          progressBarClassName='bg-red-700'
          className='bg-green-600'
        />
        <p className='mt-2 flex flex-col text-[22px] text-primary/80'>
          <span className={cn('font-bold')}>
            {formatCurrency({
              cents: balanceWithFullPouchesSum,
              currency,
              language: locale as Language
            })}
          </span>
          <span className='text-[12px] text-primary/40'>
            {t('currentBudgetBalanceWithPouches')}
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
