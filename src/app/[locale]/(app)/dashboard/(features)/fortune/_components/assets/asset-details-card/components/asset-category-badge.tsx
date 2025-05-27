import { AssetCategory } from '@prisma/client';
import { ChartNoAxesCombined, House, Shield, Wallet } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';

const categoryToIcon = {
  [AssetCategory.FINANCIAL_CUSHION]: <Shield className='size-4!' />,
  [AssetCategory.LIVING_ASSETS]: <House className='size-4!' />,
  [AssetCategory.INVESTMENTS]: <ChartNoAxesCombined className='size-4!' />,
  [AssetCategory.OTHER]: <Wallet className='size-4!' />
};

export const AssetCategoryBadge = ({
  category
}: {
  category: AssetCategory;
}) => {
  const t = useTranslations('fortune.assets.assetDetailsCard');

  return (
    <Badge className='flex items-center gap-2 bg-blue-700 text-white'>
      {categoryToIcon[category]}
      {category === AssetCategory.LIVING_ASSETS && t('livingAssets')}
      {category === AssetCategory.INVESTMENTS && t('investmentAssets')}
      {category === AssetCategory.OTHER && t('otherAssets')}
      {category === AssetCategory.FINANCIAL_CUSHION && t('financialCushion')}
    </Badge>
  );
};
