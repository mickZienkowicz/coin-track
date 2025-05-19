import { format, isAfter } from 'date-fns';
import { CheckCircle2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { FormattedCurrency } from '@/app/[locale]/dashboard/_components/formatted-currency/formatted-currency';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Language } from '@/i18n/routing';
import { getUtcMiddayDateOfGivenDate } from '@/lib/dates/get-utc-midday-date-of-given-date';
import { getDateFnsLocaleFromLanguage } from '@/lib/locale/get-date-fns-locale-from-language';
import { cn } from '@/lib/utils';
import type { GoalWithAdditionalInfo } from '@/server/goal/queries/get-goals';

import { DeleteGoalDialog } from '../delete-goal/delete-goal-dialog';
import { EditGoalDialog } from '../edit-goal/edit-goal-dialog';
import { FinishGoalDialog } from '../finish-goal/finish-goal-dialog';
import { GoalFinishInfoParapraph } from './_components/goal-finish-info-parapraph';
import { GoalInfoParagraph } from './_components/goal-info-paragraph';
import { GoalProgressInfoParagraph } from './_components/goal-progress-info-paragraph';
import { ScheduleDialog } from './_components/schedule-dialog';

export const GoalCard = ({ goal }: { goal: GoalWithAdditionalInfo }) => {
  const locale = useLocale();
  const t = useTranslations('goals.goalCard');

  const goalProgress = (goal.currentSavings / goal.valueCents) * 100;

  const isFinished =
    !!goal.finishedAt ||
    isAfter(getUtcMiddayDateOfGivenDate(new Date()), goal.endDate);

  return (
    <Card className='pb-4! w-full gap-4' data-tour='goal-card'>
      {isFinished && (
        <Badge
          variant='outline'
          className='mx-6 h-auto border-gray-200 bg-gray-100 py-1 text-gray-800'
        >
          <CheckCircle2 className='size-4! mr-1' />
          {t('finishedBadge')}
          {' - '}
          {format(goal.finishedAt || goal.endDate, 'd MMMM yyyy', {
            locale: getDateFnsLocaleFromLanguage(locale as Language)
          })}
        </Badge>
      )}
      <CardContent className={cn(isFinished && 'opacity-30', 'grow')}>
        <h3 className='mb-1 flex items-center justify-between gap-2 text-2xl font-bold'>
          <span className='overflow-hidden text-ellipsis break-words'>
            {goal.name}
          </span>
          <Badge
            className={cn('bg-blue-600 font-bold tracking-tighter text-white')}
          >
            {goalProgress.toFixed(0)}%
          </Badge>
        </h3>
        <div className='mt-2 flex justify-between gap-2'>
          <GoalFinishInfoParapraph className='font-bold'>
            <FormattedCurrency valueCents={goal.valueCents} />
          </GoalFinishInfoParapraph>
          {isFinished && (
            <GoalFinishInfoParapraph>
              {format(goal.endDate, 'd MMMM yyyy', {
                locale: getDateFnsLocaleFromLanguage(locale as Language)
              })}
            </GoalFinishInfoParapraph>
          )}
        </div>
        <div className='mb-2 mt-4 flex items-center justify-between gap-2'>
          <GoalProgressInfoParagraph
            label={t('sumOfDeposits')}
            side='left'
            className='text-blue-500'
            value={<FormattedCurrency valueCents={goal.currentSavings} />}
          />
          <GoalProgressInfoParagraph
            label={t('remainingToGoal')}
            side='right'
            value={
              <FormattedCurrency
                valueCents={goal.valueCents - goal.currentSavings}
              />
            }
          />
        </div>
        <Progress progressBarClassName='bg-blue-600' value={goalProgress} />

        <GoalInfoParagraph
          className='mt-4'
          label={t('initialDeposit')}
          value={<FormattedCurrency valueCents={goal.initialDepositCents} />}
        />

        {!isFinished && (
          <div className='mt-4 flex justify-end'>
            <ScheduleDialog goal={goal} />
          </div>
        )}
      </CardContent>
      <CardFooter className='pt-4! flex w-full items-center justify-end gap-4 border-t border-sidebar-border'>
        <div className='flex items-center gap-2'>
          {!isFinished && <EditGoalDialog goal={goal} />}
          {!isFinished && <FinishGoalDialog goalId={goal.id} />}
          <DeleteGoalDialog goalId={goal.id} />
        </div>
      </CardFooter>
    </Card>
  );
};
