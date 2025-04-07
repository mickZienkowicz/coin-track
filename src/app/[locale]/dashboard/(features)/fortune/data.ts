import { Asset, AssetCategory, Debt } from '@prisma/client';

export const assets: Asset[] = [
  {
    id: '1',
    name: 'Mieszkanie',
    category: AssetCategory.LIVING_ASSETS,
    valueCents: 60000000,
    familyId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '1',
    name: 'Samochód',
    category: AssetCategory.LIVING_ASSETS,
    valueCents: 1000000,
    familyId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '1',
    name: 'Konto oszczędnościowe',
    category: AssetCategory.FINANCIAL_CUSHION,
    valueCents: 2000000,
    familyId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '1',
    name: 'Gotówka w złotówkach',
    category: AssetCategory.FINANCIAL_CUSHION,
    valueCents: 2000000,
    familyId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '1',
    name: 'Złoto',
    category: AssetCategory.FINANCIAL_CUSHION,
    valueCents: 100000,
    familyId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '1',
    name: 'Obligacje',
    category: AssetCategory.INVESTMENTS,
    valueCents: 100000,
    familyId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '1',
    name: 'Akcje',
    category: AssetCategory.INVESTMENTS,
    valueCents: 100000,
    familyId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '1',
    name: 'Inne',
    category: AssetCategory.OTHER,
    valueCents: 100000,
    familyId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const debts: Debt[] = [
  {
    id: '1',
    name: 'Kredyt hipoteczny',
    valueCents: 1000000,
    familyId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Kredyt konsumencki',
    valueCents: 1000000,
    familyId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Kredyt gotówkowy',
    valueCents: 1000000,
    familyId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'Kredyt gotówkowy',
    valueCents: 1000000,
    familyId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
