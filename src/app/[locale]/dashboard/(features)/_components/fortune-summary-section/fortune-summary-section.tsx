import { format } from 'date-fns';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { FormattedCurrency } from '@/app/[locale]/dashboard/_components/formatted-currency/formatted-currency';
import { cn } from '@/lib/utils';

import { FortuneCard } from './_components/fortune-card';
import { MobileFortuneCard } from './_components/mobile-fortune-card';
import { NetWorthCard } from './_components/net-worth-card';

export const FortuneSummarySection = ({
  className
}: {
  className?: string;
}) => {
  const t = useTranslations('dashboard.fortune');

  const lastUpdateDate = format(new Date(), 'd.MM.yyyy');

  const netWorth = <FormattedCurrency valueCents={2000000000} />;
  const assetsCount = <FormattedCurrency valueCents={2000000000} />;
  const debtsCount = <FormattedCurrency valueCents={2000000000} />;

  return (
    <>
      <div className={cn('md:hidden', className)}>
        <MobileFortuneCard
          netWorth={netWorth}
          assetsCount={assetsCount}
          debtsCount={debtsCount}
          lastUpdateDate={lastUpdateDate}
        />
      </div>
      <div className='hidden grid-cols-1 gap-6 md:grid md:grid-cols-2 lg:grid-cols-[1fr_1.25fr] 2xl:grid-cols-3'>
        <FortuneCard
          title={t('assets')}
          description={`${t('assetsDescription')} ${lastUpdateDate}`}
          icon={
            <div className='flex size-10  shrink-0 items-center justify-center rounded-full bg-green-600/20'>
              <TrendingUp className='size-6 text-green-600' />
            </div>
          }
          value={assetsCount}
        />

        <FortuneCard
          className='lg:order-last 2xl:order-none'
          title={t('debts')}
          description={`${t('debtsDescription')} ${lastUpdateDate}`}
          icon={
            <div className='flex size-9 shrink-0 items-center justify-center rounded-full bg-red-700/20 md:size-11'>
              <TrendingDown className='size-5 text-red-700 md:size-6' />
            </div>
          }
          value={debtsCount}
        />

        <NetWorthCard
          className='md:col-span-2 lg:col-span-1 lg:row-span-2 2xl:row-span-1'
          title={t('netWorth')}
          description={`${t('netWorthDescription')} ${lastUpdateDate}`}
          icon={
            <div className='flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-600/20 md:size-11'>
              <Wallet className='size-5 text-blue-600 md:size-6' />
            </div>
          }
          value={netWorth}
        />
      </div>
    </>
  );
};
