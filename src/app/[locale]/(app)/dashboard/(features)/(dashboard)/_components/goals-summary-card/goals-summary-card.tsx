import { Target } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/i18n/navigation';
import { pathGenerators } from '@/lib/paths';
import { cn } from '@/lib/utils';
import { getGoals } from '@/server/goal/queries/get-goals';

import { GoalItem } from './_components/goal-item';

export const GoalsSummaryCard = async () => {
  const goals = await getGoals();
  const t = await getTranslations('dashboard.goalsSummaryCard');

  return (
    <Card className='gap-0' data-tour='goals-card'>
      <CardHeader className='pb-2'>
        <CardTitle className='flex items-center gap-3 text-lg'>
          <div className='flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-600/20 md:size-11'>
            <Target className='size-5 text-blue-600 md:size-6' />
          </div>
          <div className='flex flex-col'>
            <h4 className='text-2xl font-bold'>{t('title')}</h4>
            <p className='text-sm font-normal text-primary/70'>
              {goals.length <= 0
                ? t('noActiveGoals')
                : t('activeGoals', { count: goals.length })}
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className='grow'>
        {goals.length <= 0 ? (
          <div className='flex h-full flex-col items-center justify-center p-6 text-center'>
            <p className='mb-4 text-primary/70'>{t('noGoals')}</p>
            <Link
              className={cn(buttonVariants({ size: 'sm' }))}
              href={pathGenerators.goals()}
            >
              {t('addFirstGoal')}
            </Link>
          </div>
        ) : (
          <>
            <ul className='mb-4 flex flex-col gap-6'>
              {goals.map((goal) => (
                <GoalItem key={goal.id} goal={goal} />
              ))}
            </ul>
            <div className='flex justify-end'>
              <Link
                href={pathGenerators.goals()}
                className={cn(buttonVariants({ size: 'sm' }))}
                data-tour='manage-goals-button'
              >
                {t('manageGoals')}
              </Link>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
