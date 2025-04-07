import { ArrowUpCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { FormattedCurrency } from '@/app/[locale]/dashboard/_components/formatted-currency/formatted-currency';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const IncomesSummaryCard = ({ incomesSum }: { incomesSum: number }) => {
  const t = useTranslations('budgetSummary');

  return (
    <Card className='gap-3 2xl:hidden'>
      <CardHeader className='relative flex items-center justify-between gap-2'>
        <CardTitle className='mr-11'>
          <h3 className='hidden text-[26px] leading-[28px] md:block'>
            {t('incomes')}
          </h3>
          <h3 className='text-[26px] font-bold leading-[28px] md:hidden'>
            <FormattedCurrency valueCents={incomesSum} />
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
            <FormattedCurrency valueCents={incomesSum} />
          </span>
          <span className='text-sm text-primary/70'>{t('incomesSummary')}</span>
        </p>
      </CardContent>
    </Card>
  );
};
