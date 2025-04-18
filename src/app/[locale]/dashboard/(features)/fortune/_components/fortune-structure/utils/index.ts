import { AssetCategory } from '@prisma/client';

import { AssetWithAdditionalInfo } from '@/server/fortune/queries/get-forune-summary';

export const getAssetsCountsByCategory = (assets: AssetWithAdditionalInfo[]) =>
  assets.reduce(
    (acc, asset) => {
      if (asset.category === AssetCategory.FINANCIAL_CUSHION) {
        acc.financialCushionCount++;
      }

      if (asset.category === AssetCategory.LIVING_ASSETS) {
        acc.livingAssetsCount++;
      }

      if (asset.category === AssetCategory.INVESTMENTS) {
        acc.investmentAssetsCount++;
      }

      if (asset.category === AssetCategory.OTHER) {
        acc.otherAssetsCount++;
      }

      return acc;
    },
    {
      financialCushionCount: 0,
      livingAssetsCount: 0,
      investmentAssetsCount: 0,
      otherAssetsCount: 0
    }
  );

export const getPercentageOfWholeFortune = (value: number, total: number) => {
  if (total === 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
};

export const getDescriptionKeyOfAssetsComponents = (count: number) => {
  if (count === 0) {
    return 'description.zero';
  }

  if (count === 1) {
    return 'description.one';
  }

  if (count < 5) {
    return 'description.few';
  }

  return 'description.many';
};
