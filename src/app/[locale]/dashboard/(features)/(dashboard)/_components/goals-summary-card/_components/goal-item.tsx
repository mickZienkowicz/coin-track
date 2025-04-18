import { isAfter } from 'date-fns';

import { FormattedCurrency } from '@/app/[locale]/dashboard/_components/formatted-currency/formatted-currency';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getUtcMiddayDateOfGivenDate } from '@/lib/dates/get-utc-midday-date-of-given-date';
import { cn } from '@/lib/utils';
import type { GoalWithAdditionalInfo } from '@/server/goal/queries/get-goals';

export const GoalItem = ({ goal }: { goal: GoalWithAdditionalInfo }) => {
  const goalProgress = (goal.currentSavings / goal.valueCents) * 100;

  const isFinished =
    !!goal.finishedAt ||
    isAfter(getUtcMiddayDateOfGivenDate(new Date()), goal.endDate);

  if (isFinished) {
    return null;
  }

  return (
    <li key={goal.id} className='flex flex-col gap-1 border-b-sidebar-border'>
      <h3 className='flex items-center justify-between gap-2 text-[25px] font-bold'>
        <span className='overflow-hidden text-ellipsis break-words leading-[30px]'>
          {goal.name}
        </span>
        <Badge
          className={cn('bg-blue-600 font-bold tracking-tighter text-white')}
        >
          {goalProgress.toFixed(0)}%
        </Badge>
      </h3>
      <div className='mt-0.5 flex items-center justify-between gap-2 text-sm font-bold text-primary/70'>
        <p>
          <FormattedCurrency valueCents={goal.currentSavings} />
        </p>
        <p>
          <FormattedCurrency valueCents={goal.valueCents} />
        </p>
      </div>
      <Progress progressBarClassName='bg-blue-600' value={goalProgress} />
    </li>
  );
};
