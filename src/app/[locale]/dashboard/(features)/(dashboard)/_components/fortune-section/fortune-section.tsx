import { format } from 'date-fns';
import { PieChart, TrendingDown, TrendingUp } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';

import { Language } from '@/i18n/routing';
import { formatCurrency } from '@/lib/currencies';
import { getDateFnsLocaleFromLanguage } from '@/lib/locale/get-date-fns-locale-from-language';

import { FortuneCard } from './_components/fortune-card';

export const FortuneSection = async ({ currency }: { currency: string }) => {
  const t = await getTranslations('dashboard.fortune');
  const locale = await getLocale();
  const lastUpdateDate = format(new Date(), 'd MMMMyyyy', {
    locale: getDateFnsLocaleFromLanguage(locale as Language)
  });

  return (
    <div className='mt-6 grid gap-6 xl:grid-cols-3'>
      <FortuneCard
        title={t('assets')}
        description={`${t('assetsDescription')} ${lastUpdateDate}`}
        icon={
          <div className='flex size-10  shrink-0 items-center justify-center rounded-full bg-green-600/20'>
            <TrendingUp className='size-6 text-green-600' />
          </div>
        }
        value={formatCurrency({
          cents: 2000,
          currency,
          language: locale as Language
        })}
      />

      <FortuneCard
        title={t('debts')}
        description={`${t('debtsDescription')} ${lastUpdateDate}`}
        icon={
          <div className='flex size-9 shrink-0 items-center justify-center rounded-full bg-red-700/20 md:size-11'>
            <TrendingDown className='size-5 text-red-700 md:size-6' />
          </div>
        }
        value={formatCurrency({
          cents: 2000,
          currency,
          language: locale as Language
        })}
      />

      <FortuneCard
        title={t('netWorth')}
        description={`${t('netWorthDescription')} ${lastUpdateDate}`}
        icon={
          <div className='flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-600/20 md:size-11'>
            <PieChart className='size-5 text-blue-600 md:size-6' />
          </div>
        }
        value={formatCurrency({
          cents: 2000,
          currency,
          language: locale as Language
        })}
      />
    </div>
  );
};
