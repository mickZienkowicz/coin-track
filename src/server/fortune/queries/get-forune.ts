import { Asset, Debt } from '@prisma/client';

export type AssetWithAdditionalInfo = Asset & {
  valueCents: number;
};

export type DebtWithAdditionalInfo = Debt & {
  valueCents: number;
};

export const getFortune = async () => {
  // const assets = await prisma.asset.findMany();
  // const debts = await prisma.debt.findMany();
  // return { assets, debts };
};
