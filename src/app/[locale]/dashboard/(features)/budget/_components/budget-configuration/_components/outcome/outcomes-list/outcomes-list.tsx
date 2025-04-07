import { ArrowDownCircle, PlusCircle } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getOutcomes } from '@/server/outcome/queries/get-outcomes';

import { AddOutcomeDialog } from '../add-outcome/add-outcome-dialog';
import { OutcomeCard } from '../outcome-card';

export const OutcomesList = async () => {
  const [t, outcomes] = await Promise.all([
    getTranslations('budget.outcomes'),
    getOutcomes()
  ]);

  return (
    <div className='mb-12 flex flex-col gap-4'>
      <Card className='py-5! mb-2'>
        <CardContent>
          <div className='flex items-center justify-between'>
            <h2 className='flex items-center gap-2 text-xl font-semibold'>
              <div className='mr-2 flex size-9  items-center justify-center rounded-full bg-red-600/20'>
                <ArrowDownCircle className='size-5 text-red-600' />
              </div>
              {t('title')}
            </h2>
            <AddOutcomeDialog>
              <Button
                variant='secondary'
                size='iconSmall'
                aria-label={t('addOutcomeButton')}
              >
                <PlusCircle className='h-4 w-4' />
              </Button>
            </AddOutcomeDialog>
          </div>
        </CardContent>
      </Card>
      <ul className='flex flex-col gap-4'>
        {outcomes.map((outcome) => (
          <li key={outcome.id}>
            <OutcomeCard outcome={outcome} />
          </li>
        ))}
        {outcomes.length === 0 && (
          <li>
            <Card className='w-full'>
              <CardContent className='flex flex-col items-center text-center'>
                <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted'>
                  <ArrowDownCircle className='h-8 w-8 text-red-600' />
                </div>
                <h2 className='mb-3 text-2xl font-semibold'>
                  {t('noOutcomesCard.title')}
                </h2>
                <p className='mb-6 max-w-xl text-muted-foreground'>
                  {t('noOutcomesCard.description')}
                </p>
                <AddOutcomeDialog>
                  <Button variant='secondary' size='sm' className='mb-2'>
                    <ArrowDownCircle className='h-4 w-4' />
                    {t('addOutcomeButton')}
                  </Button>
                </AddOutcomeDialog>
              </CardContent>
            </Card>
          </li>
        )}
      </ul>
    </div>
  );
};
