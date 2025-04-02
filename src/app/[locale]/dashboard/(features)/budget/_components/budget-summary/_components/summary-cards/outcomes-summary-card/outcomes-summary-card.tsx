import { ArrowDownCircle } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Language } from '@/i18n/routing';
import { formatCurrency } from '@/lib/currencies';

export const OutcomesSummaryCard = ({
  outcomesSum,
  currency
}: {
  outcomesSum: number;
  currency: string;
}) => {
  const locale = useLocale();
  const t = useTranslations('budgetSummary');
  return (
    <Card className='gap-3 2xl:hidden'>
      <CardHeader className='relative flex items-center justify-between gap-2'>
        <CardTitle className='mr-11 text-[26px] leading-[28px]'>
          {t('outcomes')}
        </CardTitle>
        <div className='absolute right-6 top-0 flex size-9 shrink-0 items-center justify-center rounded-full bg-red-600/20 md:size-11'>
          <ArrowDownCircle className='size-5 text-red-600 md:size-6' />
        </div>
      </CardHeader>
      <CardContent>
        <p className='flex flex-col'>
          <span className='flex items-center justify-between text-[26px] font-bold text-primary/90'>
            {formatCurrency({
              cents: outcomesSum,
              currency,
              language: locale as Language
            })}
          </span>
          <span className='text-sm text-primary/50'>
            {t('outcomesSummary')}
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
