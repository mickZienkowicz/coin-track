import { Asset } from '@prisma/client';
import { format } from 'date-fns';
import { ArrowUpCircle, Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { FormattedCurrency } from '@/app/[locale]/dashboard/_components/formatted-currency/formatted-currency';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { DeleteAssetDialog } from '../delete-asset/delete-asset-dialog';
import { EditAssetDialog } from '../edit-asset/edit-asset-dialog';
import { AssetCategoryBadge } from './components/asset-category-badge';

export const AssetDetailsCard = ({ asset }: { asset: Asset }) => {
  const t = useTranslations('fortune.assets.assetDetailsCard');

  return (
    <Card className='pb-4! @container w-full gap-4'>
      <CardHeader
        className={cn(
          'mb-2 flex flex-col items-start justify-between gap-4 md:flex-row'
        )}
      >
        <div className='flex w-full flex-col gap-1.5'>
          <div className='flex w-full items-center justify-between gap-3'>
            <h3 className='overflow-hidden text-ellipsis break-words text-2xl font-semibold'>
              {asset.name}
            </h3>
          </div>
          <p className='text-sm text-primary/70'>
            <Calendar className='mr-1 inline-block h-3.5 w-3.5' />
            {t('lastUpdate')} {format(asset.updatedAt, 'dd.MM.yyyy')}
          </p>
        </div>
        <div className='flex shrink-0 items-center'>
          <div className='flex items-center rounded-full bg-blue-50 px-3 py-1'>
            <span className='text-xs font-medium text-blue-700'>
              5% {t('yourFortune')}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className='flex flex-col gap-3'>
        <div className='flex flex-col justify-between gap-4'>
          <AssetCategoryBadge category={asset.category} />
          <div className='-order-1 flex items-center md:order-1'>
            <div className='mr-3 flex size-12 items-center justify-center rounded-full bg-green-600/10'>
              <ArrowUpCircle className='size-6 text-green-600' />
            </div>
            <div>
              <p className='text-sm font-medium text-primary/70'>
                {t('amount')}
              </p>
              <p className='text-2xl font-bold'>
                <FormattedCurrency valueCents={asset.valueCents} />
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className='pt-4! mt-1 flex w-full items-center justify-end gap-4 border-t border-sidebar-border'>
        <EditAssetDialog />
        <DeleteAssetDialog />
      </CardFooter>
    </Card>
  );
};
