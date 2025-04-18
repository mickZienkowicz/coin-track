import { useMemo } from 'react';
import { ChartNoAxesCombined, House, Shield, Wallet } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { FormattedCurrency } from '@/app/[locale]/dashboard/_components/formatted-currency/formatted-currency';
import { FortuneSummary } from '@/server/fortune/queries/get-forune-summary';

import { FortuneStructureCard } from './_components/fortune-structure-card';
import { MobileFortunesStructureCard } from './_components/mobile-fortune-structure-card';
import {
  getAssetsCountsByCategory,
  getDescriptionKeyOfAssetsComponents,
  getPercentageOfWholeFortune
} from './utils';

export const FortuneStructure = ({
  fortuneSummary
}: {
  fortuneSummary: FortuneSummary;
}) => {
  const t = useTranslations('fortune.structure');

  const {
    financialCushionCount,
    livingAssetsCount,
    investmentAssetsCount,
    otherAssetsCount
  } = useMemo(
    () => getAssetsCountsByCategory(fortuneSummary.assets),
    [fortuneSummary.assets]
  );

  return (
    <>
      <section className='md:hidden'>
        <MobileFortunesStructureCard
          monthlySpendingsMultiplier={
            fortuneSummary.totalAssets
              ? fortuneSummary.totalAssets / fortuneSummary.monthlyOutcomesSum
              : 0
          }
          financialCushion={
            <FormattedCurrency
              valueCents={fortuneSummary.financialCushionAssetsValueSum}
            />
          }
          financialCushionPercentageOfWholeFortune={getPercentageOfWholeFortune(
            fortuneSummary.financialCushionAssetsValueSum,
            fortuneSummary.totalAssets
          )}
          livingAssets={
            <FormattedCurrency
              valueCents={fortuneSummary.livingAssetsValueSum}
            />
          }
          livingAssetsPercentageOfWholeFortune={getPercentageOfWholeFortune(
            fortuneSummary.livingAssetsValueSum,
            fortuneSummary.totalAssets
          )}
          investments={
            <FormattedCurrency
              valueCents={fortuneSummary.investmentsAssetsValueSum}
            />
          }
          investmentsPercentageOfWholeFortune={getPercentageOfWholeFortune(
            fortuneSummary.investmentsAssetsValueSum,
            fortuneSummary.totalAssets
          )}
          restOfAssets={
            <FormattedCurrency
              valueCents={fortuneSummary.otherAssetsValueSum}
            />
          }
          restOfAssetsPercentageOfWholeFortune={getPercentageOfWholeFortune(
            fortuneSummary.otherAssetsValueSum,
            fortuneSummary.totalAssets
          )}
        />
      </section>
      <section className='hidden grid-cols-1 gap-6 md:grid md:grid-cols-2 2xl:grid-cols-4'>
        <FortuneStructureCard
          icon={<Shield className='mr-1 inline-block h-3.5 w-3.5' />}
          title={t('financialCushion')}
          value={
            <FormattedCurrency
              valueCents={fortuneSummary.financialCushionAssetsValueSum}
            />
          }
          description={t(
            getDescriptionKeyOfAssetsComponents(financialCushionCount),
            { count: financialCushionCount }
          )}
          percentageOfWholeFortune={getPercentageOfWholeFortune(
            fortuneSummary.financialCushionAssetsValueSum,
            fortuneSummary.totalAssets
          )}
          monthlySpendingsMultiplier={
            fortuneSummary.totalAssets
              ? fortuneSummary.financialCushionAssetsValueSum /
                fortuneSummary.monthlyOutcomesSum
              : 0
          }
        />

        <FortuneStructureCard
          icon={<House className='mr-1 inline-block h-3.5 w-3.5' />}
          title={t('livingAssets')}
          value={
            <FormattedCurrency
              valueCents={fortuneSummary.livingAssetsValueSum}
            />
          }
          description={t(
            getDescriptionKeyOfAssetsComponents(livingAssetsCount),
            { count: livingAssetsCount }
          )}
          percentageOfWholeFortune={getPercentageOfWholeFortune(
            fortuneSummary.livingAssetsValueSum,
            fortuneSummary.totalAssets
          )}
        />
        <FortuneStructureCard
          icon={
            <ChartNoAxesCombined className='mr-1 inline-block h-3.5 w-3.5' />
          }
          title={t('investmentAssets')}
          value={
            <FormattedCurrency
              valueCents={fortuneSummary.investmentsAssetsValueSum}
            />
          }
          description={t(
            getDescriptionKeyOfAssetsComponents(investmentAssetsCount),
            { count: investmentAssetsCount }
          )}
          percentageOfWholeFortune={getPercentageOfWholeFortune(
            fortuneSummary.investmentsAssetsValueSum,
            fortuneSummary.totalAssets
          )}
        />
        <FortuneStructureCard
          icon={<Wallet className='mr-1 inline-block h-3.5 w-3.5' />}
          title={t('otherAssets')}
          value={
            <FormattedCurrency
              valueCents={fortuneSummary.otherAssetsValueSum}
            />
          }
          description={t(
            getDescriptionKeyOfAssetsComponents(otherAssetsCount),
            { count: otherAssetsCount }
          )}
          percentageOfWholeFortune={getPercentageOfWholeFortune(
            fortuneSummary.otherAssetsValueSum,
            fortuneSummary.totalAssets
          )}
        />
      </section>
    </>
  );
};
