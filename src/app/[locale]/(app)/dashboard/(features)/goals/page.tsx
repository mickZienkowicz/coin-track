import { useTranslations } from 'next-intl';

import { NoFamilyCardFallback } from '../../_components/no-family-card-fallback/no-family-card-fallback';
import { AddGoalDialog } from './_components/add-goal/add-goal-dialog';
import { GoalsList } from './_components/goals-list';

export default function GoalsPage() {
  const t = useTranslations('goals');

  return (
    <div>
      <div className='@container relative mr-14 flex items-center justify-between gap-4 lg:mr-0 2xl:mt-2'>
        <div className='@xl:flex-row flex flex-col items-center justify-start gap-6'>
          <h1 className='@xl:w-auto flex min-h-11 w-full items-center text-start text-3xl font-semibold'>
            {t('title')}
          </h1>
        </div>
        <AddGoalDialog />
      </div>

      <NoFamilyCardFallback>
        <GoalsList />
      </NoFamilyCardFallback>
    </div>
  );
}
