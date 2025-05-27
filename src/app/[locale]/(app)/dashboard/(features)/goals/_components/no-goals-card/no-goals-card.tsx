import { PlusCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { AddGoalDialog } from '../add-goal/add-goal-dialog';

export const NoGoalsCard = () => {
  const t = useTranslations('goals');

  return (
    <Card className='mt-6 w-full'>
      <CardContent className='flex flex-col items-center px-8 pb-6 pt-10 text-center'>
        <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted'>
          <PlusCircle className='h-8 w-8 text-muted-foreground' />
        </div>
        <h2 className='mb-3 text-2xl font-semibold'>
          {t('noGoalsCard.title')}
        </h2>
        <p className='mb-6 max-w-xl text-muted-foreground'>
          {t('noGoalsCard.description')}
        </p>
        <AddGoalDialog>
          <Button>
            <PlusCircle />
            {t('noGoalsCard.addGoalButton')}
          </Button>
        </AddGoalDialog>
      </CardContent>
    </Card>
  );
};
