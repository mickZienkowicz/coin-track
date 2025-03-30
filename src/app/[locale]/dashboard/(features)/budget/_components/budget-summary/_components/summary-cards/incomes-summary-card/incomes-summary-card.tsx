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
        <CardTitle className='mr-11 text-[26px] leading-[28px]'>
          {t('incomes')}
        </CardTitle>
        <div className='absolute right-6 top-0 flex size-11  items-center justify-center rounded-full bg-green-600/20'>
          <ArrowUpCircle className='size-6 text-green-600' />
        </div>
      </CardHeader>
      <CardContent>
        <p className='flex flex-col'>
          <span className='flex items-center justify-between text-[26px] font-bold text-primary/90'>
            {formatCurrency({
              cents: incomesSum,
              currency,
              language: locale as Language
            })}
          </span>
          <span className='text-sm text-primary/50'>{t('incomesSummary')}</span>
        </p>
      </CardContent>
    </Card>
  );
};
