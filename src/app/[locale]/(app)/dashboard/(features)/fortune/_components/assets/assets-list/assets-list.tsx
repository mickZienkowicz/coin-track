import { PlusCircle, TrendingUp } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { AdditionalInfoTooltip } from '@/components/additional-info-tooltip';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AssetWithAdditionalInfo } from '@/server/fortune/queries/get-forune-summary';

import { AddAssetDialog } from '../add-asset/add-asset-dialog';
import { AssetDetailsCard } from '../asset-details-card';

export const AssetsList = async ({
  assets,
  totalAssets
}: {
  assets: AssetWithAdditionalInfo[];
  totalAssets: number;
}) => {
  const t = await getTranslations('fortune.assets');

  return (
    <div className='mb-12 flex flex-col gap-4'>
      <Card className='py-5! mb-2'>
        <CardContent>
          <div className='flex items-center justify-between'>
            <h2 className='flex items-center gap-2 text-xl font-semibold'>
              <div className='mr-2 flex size-9  items-center justify-center rounded-full bg-green-600/20'>
                <TrendingUp className='size-6 text-green-600' />
              </div>
              {t('title')}
              <AdditionalInfoTooltip text={t('assetsAdditionalInfo')} />
            </h2>
            <AddAssetDialog>
              <Button
                variant='secondary'
                size='iconSmall'
                aria-label={t('addAssetButton')}
                data-tour='add-asset-button'
              >
                <PlusCircle className='h-4 w-4' />
              </Button>
            </AddAssetDialog>
          </div>
        </CardContent>
      </Card>
      <ul className='flex flex-col gap-4'>
        {assets.map((asset) => (
          <li key={asset.id}>
            <AssetDetailsCard asset={asset} totalAssets={totalAssets} />
          </li>
        ))}
        {assets.length === 0 && (
          <li>
            <Card className='w-full'>
              <CardContent className='flex flex-col items-center text-center'>
                <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted'>
                  <TrendingUp className='size-8 text-green-600' />
                </div>
                <h2 className='mb-3 text-2xl font-semibold'>
                  {t('noAssetsCard.title')}
                </h2>
                <p className='mb-6 max-w-xl text-muted-foreground'>
                  {t('noAssetsCard.description')}
                </p>
                <AddAssetDialog>
                  <Button variant='secondary' size='sm' className='mb-2'>
                    <TrendingUp className='h-4 w-4' />
                    {t('addAssetButton')}
                  </Button>
                </AddAssetDialog>
              </CardContent>
            </Card>
          </li>
        )}
      </ul>
    </div>
  );
};
