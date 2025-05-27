import { getGoals } from '@/server/goal/queries/get-goals';

import { GoalCard } from '../goal-card';
import { NoGoalsCard } from '../no-goals-card';

export const GoalsList = async () => {
  const goals = await getGoals();

  if (goals.length <= 0) {
    return <NoGoalsCard />;
  }

  return (
    <div className='mt-6'>
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3'>
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  );
};
