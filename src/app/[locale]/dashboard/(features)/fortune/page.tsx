import { useTranslations } from 'next-intl';

import { FortuneSummarySection } from '../_components/fortune-summary-section';
import { NoFamilyCardFallback } from '../../_components/no-family-card-fallback';
import { AddAssetDialog } from './_components/assets/add-asset/add-asset-dialog';
import { AssetsList } from './_components/assets/assets-list';
import { AddDebtDialog } from './_components/debts/add-debt/add-debt-dialog';
import { DebtsList } from './_components/debts/debts-list';
import { FortuneStructure } from './_components/fortune-structure/fortune-structure';

export default function FortunePage() {
  const t = useTranslations('fortune');

  return (
    <div className='@container'>
      <div className='@xl:flex-row flex flex-col items-center justify-between gap-4 2xl:mt-2'>
        <div className='@xl:flex-row @xl:items-center @xl:justify-start flex w-full flex-col gap-6'>
          <h1 className='@xl:w-auto mr-14 flex min-h-11 items-center text-start text-3xl font-semibold lg:mr-0'>
            {t('title')}
          </h1>
        </div>
      </div>

      <NoFamilyCardFallback>
        <div className='mt-6 flex flex-col gap-6'>
          <FortuneSummarySection />
          <div className='grid w-full grid-cols-2 items-center gap-2 md:flex md:justify-end'>
            <AddAssetDialog />
            <AddDebtDialog />
          </div>

          <FortuneStructure />
          <section className='mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2'>
            <AssetsList />
            <DebtsList />
          </section>
        </div>
      </NoFamilyCardFallback>
    </div>
  );
}
