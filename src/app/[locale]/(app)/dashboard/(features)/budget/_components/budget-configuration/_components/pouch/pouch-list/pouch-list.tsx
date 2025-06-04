import { PlusCircle, ShoppingCart } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { AdditionalInfoTooltip } from '@/components/additional-info-tooltip';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getPouches } from '@/server/pouch/queries/get-pouch';

import { AddPouchDialog } from '../add-pouch/add-pouch-dialog';
import { PouchCard } from '../pouch-card';

export const PouchList = async ({
  shouldShowPastItems
}: {
  shouldShowPastItems: boolean;
}) => {
  const [t, pouches] = await Promise.all([
    getTranslations('budget.pouch'),
    getPouches()
  ]);

  const filteredPouches = shouldShowPastItems
    ? pouches
    : pouches.filter((pouch) => !pouch.isFinished && !pouch.isStopped);

  return (
    <div className='mb-12 flex flex-col gap-4'>
      <Card className='py-5! mb-2'>
        <CardContent>
          <div className='flex items-center justify-between'>
            <h2 className='flex items-center gap-2 text-xl font-semibold'>
              <div className='mr-2 flex size-9  items-center justify-center rounded-full bg-blue-600/20'>
                <ShoppingCart className='size-5 text-blue-600' />
              </div>
              {t('title')}
              <AdditionalInfoTooltip text={t('additionalInfo')} />
            </h2>
            <AddPouchDialog>
              <Button
                variant='secondary'
                size='iconSmall'
                aria-label={t('addPouchButton')}
              >
                <PlusCircle className='h-4 w-4' />
              </Button>
            </AddPouchDialog>
          </div>
        </CardContent>
      </Card>
      <ul className='flex flex-col gap-3'>
        {filteredPouches.map((pouch) => (
          <li key={pouch.id}>
            <PouchCard pouch={pouch} />
          </li>
        ))}
        {filteredPouches.length === 0 && (
          <li>
            <Card className='w-full'>
              <CardContent className='flex flex-col items-center text-center'>
                <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted'>
                  <ShoppingCart className='h-8 w-8 text-blue-600' />
                </div>
                <h2 className='mb-3 text-2xl font-semibold'>
                  {t('noPouchesCard.title')}
                </h2>
                <p className='mb-6 max-w-xl text-muted-foreground'>
                  {t('noPouchesCard.description')}
                </p>
                <AddPouchDialog>
                  <Button variant='secondary' size='sm' className='mb-2'>
                    <ShoppingCart className='h-4 w-4' />
                    {t('addPouchButton')}
                  </Button>
                </AddPouchDialog>
              </CardContent>
            </Card>
          </li>
        )}
      </ul>
    </div>
  );
};
