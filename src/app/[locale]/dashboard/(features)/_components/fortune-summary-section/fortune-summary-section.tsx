import { closestTo, format } from 'date-fns';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { FormattedCurrency } from '@/app/[locale]/dashboard/_components/formatted-currency/formatted-currency';
import { cn } from '@/lib/utils';
import { FortuneSummary } from '@/server/fortune/queries/get-forune-summary';

import { FortuneCard } from './_components/fortune-card';
import { MobileFortuneCard } from './_components/mobile-fortune-card';
import { NetWorthCard } from './_components/net-worth-card';

export const FortuneSummarySection = ({
  className,
  fortuneSummary,
  shoudlAddDataTourTags
}: {
  className?: string;
  fortuneSummary: FortuneSummary;
  shoudlAddDataTourTags?: boolean;
}) => {
  const t = useTranslations('dashboard.fortune');

  const netWorth = (
    <FormattedCurrency valueCents={fortuneSummary.totalNetWorth} />
  );
  const assetsCount = (
    <FormattedCurrency valueCents={fortuneSummary.totalAssets} />
  );
  const debtsCount = (
    <FormattedCurrency valueCents={fortuneSummary.totalDebts} />
  );

  const lastAssetsUpdateDate = closestTo(
    new Date(),
    fortuneSummary?.assets.map((asset) => asset.updatedAt) ?? []
  );
  const lastDebtsUpdateDate = closestTo(
    new Date(),
    fortuneSummary?.debts.map((debt) => debt.updatedAt) ?? []
  );

  const lastUpdateDate = closestTo(
    new Date(),
    [lastAssetsUpdateDate, lastDebtsUpdateDate].filter(
      (item) => typeof item === 'object'
    )
  );

  return (
    <>
      <div
        className={cn('md:hidden', className)}
        data-tour={shoudlAddDataTourTags && 'assets-cards'}
      >
        <MobileFortuneCard
          netWorth={netWorth}
          assetsCount={assetsCount}
          debtsCount={debtsCount}
          lastUpdateDate={lastUpdateDate && format(lastUpdateDate, 'd.MM.yyyy')}
        />
      </div>
      <div
        className='hidden grid-cols-1 gap-6 md:grid md:grid-cols-2 lg:grid-cols-[1fr_1.25fr] 2xl:grid-cols-3'
        data-tour={shoudlAddDataTourTags && 'assets-cards'}
      >
        <FortuneCard
          dataTour='assets-count-card'
          title={t('assets')}
          description={
            lastAssetsUpdateDate &&
            `${t('assetsDescription')} ${format(
              lastAssetsUpdateDate,
              'd.MM.yyyy'
            )}`
          }
          icon={
            <div className='flex size-10  shrink-0 items-center justify-center rounded-full bg-green-600/20'>
              <TrendingUp className='size-6 text-green-600' />
            </div>
          }
          value={assetsCount}
        />

        <FortuneCard
          dataTour='debts-count-card'
          className='lg:order-last 2xl:order-none'
          title={t('debts')}
          description={
            lastDebtsUpdateDate &&
            `${t('debtsDescription')} ${format(
              lastDebtsUpdateDate,
              'd.MM.yyyy'
            )}`
          }
          icon={
            <div className='flex size-9 shrink-0 items-center justify-center rounded-full bg-red-700/20 md:size-11'>
              <TrendingDown className='size-5 text-red-700 md:size-6' />
            </div>
          }
          value={debtsCount}
        />

        <NetWorthCard
          dataTour='net-worth-card'
          className='md:col-span-2 lg:col-span-1 lg:row-span-2 2xl:row-span-1'
          title={t('netWorth')}
          description={
            lastUpdateDate &&
            `${t('netWorthDescription')} ${format(lastUpdateDate, 'd.MM.yyyy')}`
          }
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
