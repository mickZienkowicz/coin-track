import { ArrowUpCircle } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';

import { Language } from '@/i18n/routing';
import { formatCurrency } from '@/lib/currencies/format-currency';

export const IncomeSummaryCard = async ({
  currency,
  incomesSum
}: {
  currency: string;
  incomesSum: number;
}) => {
  const t = await getTranslations('dashboard.balance.income');
  const locale = await getLocale();

  return (
    <div className='flex flex-col gap-1'>
      <div className='flex flex-col gap-1 md:flex-row md:items-center md:gap-4'>
        <h4 className='mt-1 flex items-center gap-3 text-xl font-bold '>
          <span className='flex size-9  items-center justify-center rounded-full bg-green-600/20'>
            <ArrowUpCircle className='size-5 text-green-600' />
          </span>
          {t('title')}
        </h4>
        <p className='text-2xl font-black text-primary/85 md:text-[25px]'>
          {formatCurrency({
            cents: incomesSum,
            currency,
            language: locale as Language
          })}
        </p>
      </div>
      <p className='hidden text-sm text-primary/50 xl:mt-[2px] xl:block'>
        {t('total')}
      </p>
    </div>
  );
};
