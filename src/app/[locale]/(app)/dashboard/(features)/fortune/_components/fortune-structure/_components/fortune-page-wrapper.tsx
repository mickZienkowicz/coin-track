import { getFortuneSummary } from '@/server/fortune/queries/get-forune-summary';

import { FortuneSummarySection } from '../../../../_components/fortune-summary-section';
import { AddAssetDialog } from '../../assets/add-asset/add-asset-dialog';
import { AssetsList } from '../../assets/assets-list';
import { AddDebtDialog } from '../../debts/add-debt/add-debt-dialog';
import { DebtsList } from '../../debts/debts-list';
import { FortuneStructure } from '../fortune-structure';

export const FortunePageWrapper = async () => {
  const fortuneSummary = await getFortuneSummary();

  return (
    <div className='mt-6 flex flex-col gap-6'>
      <FortuneSummarySection fortuneSummary={fortuneSummary} />
      <div className='grid w-full grid-cols-2 items-center gap-2 md:flex md:justify-end'>
        <AddAssetDialog />
        <AddDebtDialog />
      </div>

      <FortuneStructure fortuneSummary={fortuneSummary} />
      <section className='mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2'>
        <AssetsList
          assets={fortuneSummary.assets}
          totalAssets={fortuneSummary.totalAssets}
        />
        <DebtsList
          debts={fortuneSummary.debts}
          totalDebts={fortuneSummary.totalDebts}
        />
      </section>
    </div>
  );
};
