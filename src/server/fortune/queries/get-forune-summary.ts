import { auth } from '@clerk/nextjs/server';
import { Asset, AssetCategory, Debt, FortuneValue } from '@prisma/client';
import { getLocale } from 'next-intl/server';

import { redirect } from '@/i18n/navigation';
import { pathGenerators } from '@/lib/paths';
import { prisma } from '@/lib/prisma/prisma-client';
import { getBudgetSummary } from '@/server/budget/queries/get-budget-summary';
import { getSelectedFamily } from '@/server/family/queries/get-selected-family';

import { getMonthlyMultiplier } from '../utils/get-monthly-multiplier';

export type AssetWithAdditionalInfo = Asset & {
  valueCents: number;
  values: FortuneValue[];
};

export type DebtWithAdditionalInfo = Debt & {
  valueCents: number;
  values: FortuneValue[];
};

export type FortuneSummary = {
  assets: AssetWithAdditionalInfo[];
  debts: DebtWithAdditionalInfo[];
  totalAssets: number;
  totalDebts: number;
  totalNetWorth: number;
  financialCushionAssetsValueSum: number;
  investmentsAssetsValueSum: number;
  livingAssetsValueSum: number;
  otherAssetsValueSum: number;
  monthlyOutcomesSum: number;
};

export const getFortuneSummary = async (): Promise<FortuneSummary> => {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    const locale = await getLocale();
    redirect({ href: pathGenerators.home(), locale });
    throw new Error('Unauthorized');
  }

  const family = await getSelectedFamily();

  const assets = await prisma.asset.findMany({
    where: {
      familyId: family?.id
    },
    include: {
      values: true
    }
  });
  const debts = await prisma.debt.findMany({
    where: {
      familyId: family?.id
    },
    include: {
      values: true
    }
  });

  const assetsWithValues = assets
    .map((asset) => ({
      ...asset,
      valueCents: asset.values.at(-1)?.valueCents ?? 0
    }))
    .filter((asset) => asset.valueCents > 0);

  const debtsWithValues = debts
    .map((debt) => ({
      ...debt,
      valueCents: debt.values.at(-1)?.valueCents ?? 0
    }))
    .filter((debt) => debt.valueCents > 0);

  const {
    financialCushionAssetsValueSum,
    investmentsAssetsValueSum,
    livingAssetsValueSum,
    otherAssetsValueSum
  } = assetsWithValues.reduce(
    (acc, asset) => {
      if (asset.category === AssetCategory.FINANCIAL_CUSHION) {
        acc.financialCushionAssetsValueSum += asset.valueCents;
      } else if (asset.category === AssetCategory.INVESTMENTS) {
        acc.investmentsAssetsValueSum += asset.valueCents;
      } else if (asset.category === AssetCategory.LIVING_ASSETS) {
        acc.livingAssetsValueSum += asset.valueCents;
      } else {
        acc.otherAssetsValueSum += asset.valueCents;
      }

      return acc;
    },
    {
      financialCushionAssetsValueSum: 0,
      investmentsAssetsValueSum: 0,
      livingAssetsValueSum: 0,
      otherAssetsValueSum: 0
    }
  );

  const budgetSummary = await getBudgetSummary();

  const monthlyMultiplier = getMonthlyMultiplier(
    budgetSummary?.budget.interval
  );

  const monthlyOutcomesSum = budgetSummary
    ? budgetSummary.outcomesSum + budgetSummary.pouchesSum * monthlyMultiplier
    : 0;

  return {
    assets: assetsWithValues,
    debts: debtsWithValues,
    totalAssets: assetsWithValues.reduce(
      (acc, asset) => acc + asset.valueCents,
      0
    ),
    totalDebts: debtsWithValues.reduce((acc, debt) => acc + debt.valueCents, 0),
    totalNetWorth:
      assetsWithValues.reduce((acc, asset) => acc + asset.valueCents, 0) -
      debtsWithValues.reduce((acc, debt) => acc + debt.valueCents, 0),

    financialCushionAssetsValueSum,
    investmentsAssetsValueSum,
    livingAssetsValueSum,
    otherAssetsValueSum,
    monthlyOutcomesSum
  };
};
