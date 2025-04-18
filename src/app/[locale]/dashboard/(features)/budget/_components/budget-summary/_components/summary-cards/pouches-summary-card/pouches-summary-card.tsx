import { ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { FormattedCurrency } from '@/app/[locale]/dashboard/_components/formatted-currency/formatted-currency';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export const PouchesSummaryCard = ({
  pouchesSum,
  pouchesOutcomesSum,
  isPreview
}: {
  pouchesSum: number;
  pouchesOutcomesSum: number;
  isPreview?: boolean;
}) => {
  const t = useTranslations('budgetSummary');
  const pouchesBalancePercentage =
    (pouchesSum <= 0 ? 0 : pouchesOutcomesSum / pouchesSum) * 100;

  return (
    <Card className='justify-between gap-2'>
      <CardHeader className='flex items-center justify-between gap-2'>
        <CardTitle className='text-[26px]'>{t('pouches')}</CardTitle>
        <div className='flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-600/20 md:size-11'>
          <ShoppingCart className='size-5 text-blue-600 md:size-6' />
        </div>
      </CardHeader>
      <CardContent className='flex flex-col gap-2'>
        <h4 className='flex flex-col'>
          <span className='flex items-center justify-between text-[26px] font-bold text-primary/90'>
            <FormattedCurrency valueCents={pouchesOutcomesSum} />
            <Badge
              className={cn(
                'bg-blue-600 font-bold tracking-tighter text-white',
                pouchesBalancePercentage >= 100 && 'bg-red-700'
              )}
            >
              {pouchesBalancePercentage.toFixed(0)}%
            </Badge>
          </span>
          <span className='text-sm text-primary/70'>
            {isPreview
              ? t('pouchesExpensesSummaryOnPreview')
              : t('pouchesExpensesSummary')}
          </span>
        </h4>

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
        <p className='mt-2 flex flex-col text-[22px] text-primary/70'>
          <span className='font-bold'>
            <FormattedCurrency valueCents={pouchesSum} />
          </span>
          <span className='text-[12px] text-primary/70'>
            {t('pouchesSummary')}
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
