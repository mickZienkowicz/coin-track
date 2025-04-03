import { ArrowUpCircle } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Language } from '@/i18n/routing';
import { formatCurrency } from '@/lib/currencies';

export const IncomesSummaryCard = ({
  incomesSum,
  currency
}: {
  incomesSum: number;
  currency: string;
}) => {
  const locale = useLocale();
  const t = useTranslations('budgetSummary');

  return (
    <Card className='gap-3 2xl:hidden'>
      <CardHeader className='relative flex items-center justify-between gap-2'>
        <CardTitle className='mr-11'>
          <h3 className='hidden text-[26px] leading-[28px] md:block'>
            {t('incomes')}
          </h3>
          <h3 className='text-[26px] font-bold leading-[28px] md:hidden'>
            {formatCurrency({
              cents: incomesSum,
              currency,
              language: locale as Language
            })}
          </h3>
          <p className='mt-1 text-sm font-normal text-primary/70 md:hidden'>
            {t('incomesSummary')}
          </p>
        </CardTitle>
        <div className='absolute right-4 top-0 flex size-9 shrink-0 items-center justify-center rounded-full bg-green-600/20 md:size-11'>
          <ArrowUpCircle className='size-5 text-green-600 md:size-6' />
        </div>
      </CardHeader>
      <CardContent className='hidden md:block'>
        <p className='flex flex-col'>
          <span className='flex items-center justify-between text-[26px] font-bold text-primary/90'>
            {formatCurrency({
              cents: incomesSum,
              currency,
              language: locale as Language
            })}
          </span>
          <span className='text-sm text-primary/70'>{t('incomesSummary')}</span>
        </p>
      </CardContent>
    </Card>
  );
};
