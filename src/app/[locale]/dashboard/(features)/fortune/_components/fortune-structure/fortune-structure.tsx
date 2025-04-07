import { ChartNoAxesCombined, House, Shield, Wallet } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { FormattedCurrency } from '@/app/[locale]/dashboard/_components/formatted-currency/formatted-currency';

import { FortuneStructureCard } from './_components/fortune-structure-card';
import { MobileFortunesStructureCard } from './_components/mobile-fortune-structure-card';

export const FortuneStructure = () => {
  const t = useTranslations('fortune.structure');

  const financialCushionCount = 1 as number;
  const livingAssetsCount = 3 as number;
  const investmentAssetsCount = 15 as number;
  const otherAssetsCount = 4 as number;

  return (
    <>
      <section className='md:hidden'>
        <MobileFortunesStructureCard
          financialCushion={<FormattedCurrency valueCents={100000} />}
          financialCushionPercentageOfWholeFortune={30}
          livingAssets={<FormattedCurrency valueCents={100000} />}
          livingAssetsPercentageOfWholeFortune={20}
          investments={<FormattedCurrency valueCents={100000} />}
          investmentsPercentageOfWholeFortune={40}
          restOfAssets={<FormattedCurrency valueCents={100000} />}
          restOfAssetsPercentageOfWholeFortune={10}
        />
      </section>
      <section className='hidden grid-cols-1 gap-6 md:grid md:grid-cols-2 2xl:grid-cols-4'>
        <FortuneStructureCard
          icon={<Shield className='mr-1 inline-block h-3.5 w-3.5' />}
          title={t('financialCushion')}
          value={<FormattedCurrency valueCents={100000} />}
          description={
            financialCushionCount === 1
              ? t('description.one', { count: financialCushionCount })
              : financialCushionCount < 5
                ? t('description.few', { count: financialCushionCount })
                : t('description.many', { count: financialCushionCount })
          }
          percentageOfWholeFortune={30}
          monthlySpendingsMultiplier={1.5}
        />

        <FortuneStructureCard
          icon={<House className='mr-1 inline-block h-3.5 w-3.5' />}
          title={t('livingAssets')}
          value={<FormattedCurrency valueCents={100000} />}
          description={
            livingAssetsCount === 1
              ? t('description.one', { count: livingAssetsCount })
              : livingAssetsCount < 5
                ? t('description.few', { count: livingAssetsCount })
                : t('description.many', { count: livingAssetsCount })
          }
          percentageOfWholeFortune={20}
        />
        <FortuneStructureCard
          icon={
            <ChartNoAxesCombined className='mr-1 inline-block h-3.5 w-3.5' />
          }
          title={t('investmentAssets')}
          value={<FormattedCurrency valueCents={100000} />}
          description={
            investmentAssetsCount === 1
              ? t('description.one', { count: investmentAssetsCount })
              : investmentAssetsCount < 5
                ? t('description.few', { count: investmentAssetsCount })
                : t('description.many', { count: investmentAssetsCount })
          }
          percentageOfWholeFortune={40}
        />
        <FortuneStructureCard
          icon={<Wallet className='mr-1 inline-block h-3.5 w-3.5' />}
          title={t('otherAssets')}
          value={<FormattedCurrency valueCents={100000} />}
          description={
            otherAssetsCount === 1
              ? t('description.one', { count: otherAssetsCount })
              : otherAssetsCount < 5
                ? t('description.few', { count: otherAssetsCount })
                : t('description.many', { count: otherAssetsCount })
          }
          percentageOfWholeFortune={10}
        />
      </section>
    </>
  );
};
