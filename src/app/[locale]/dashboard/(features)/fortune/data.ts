import { AssetCategory } from '@prisma/client';

import {
  AssetWithAdditionalInfo,
  DebtWithAdditionalInfo
} from '@/server/fortune/queries/get-forune';

export const assets: AssetWithAdditionalInfo[] = [
  {
    id: '1',
    name: 'Mieszkanie',
    category: AssetCategory.LIVING_ASSETS,
    valueCents: 60000000,
    familyId: '1',
    description: 'Mieszkanie w Warszawie',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '1',
    name: 'Samochód',
    category: AssetCategory.LIVING_ASSETS,
    valueCents: 1000000,
    familyId: '1',
    description: 'Samochód osobowy',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '1',
    name: 'Konto oszczędnościowe',
    category: AssetCategory.FINANCIAL_CUSHION,
    valueCents: 2000000,
    familyId: '1',
    description: 'Konto oszczędnościowe',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '1',
    name: 'Gotówka w złotówkach',
    category: AssetCategory.FINANCIAL_CUSHION,
    valueCents: 2000000,
    familyId: '1',
    description: 'Gotówka w złotówkach',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '1',
    name: 'Złoto',
    category: AssetCategory.FINANCIAL_CUSHION,
    valueCents: 100000,
    familyId: '1',
    description: 'Złoto',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '1',
    name: 'Obligacje',
    category: AssetCategory.INVESTMENTS,
    valueCents: 100000,
    familyId: '1',
    description: 'Obligacje',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '1',
    name: 'Akcje',
    category: AssetCategory.INVESTMENTS,
    valueCents: 100000,
    familyId: '1',
    description: 'Akcje',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '1',
    name: 'Inne',
    category: AssetCategory.OTHER,
    valueCents: 100000,
    familyId: '1',
    description: 'Inne',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const debts: DebtWithAdditionalInfo[] = [
  {
    id: '1',
    name: 'Kredyt hipoteczny',
    valueCents: 1000000,
    familyId: '1',
    description: 'Kredyt hipoteczny',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Kredyt konsumencki',
    valueCents: 1000000,
    familyId: '1',
    description: 'Kredyt konsumencki',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Kredyt gotówkowy',
    valueCents: 1000000,
    familyId: '1',
    description: 'Kredyt gotówkowy',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'Kredyt gotówkowy',
    valueCents: 1000000,
    familyId: '1',
    description: 'Kredyt gotówkowy',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
