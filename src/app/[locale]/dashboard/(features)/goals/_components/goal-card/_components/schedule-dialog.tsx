import { useMemo } from 'react';
import { format } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { FormattedCurrency } from '@/app/[locale]/dashboard/_components/formatted-currency/formatted-currency';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Language } from '@/i18n/routing';
import { getDateFnsLocaleFromLanguage } from '@/lib/locale/get-date-fns-locale-from-language';
import { cn } from '@/lib/utils';
import { GoalWithAdditionalInfo } from '@/server/goal/queries/get-goals';
import { GoalOutcomeStatus } from '@/server/goal/utils/get-goal-outcome-status/get-goal-outcome-status';

import { EditGoalOutcomeDialog } from '../../edit-goal-outcome/edit-goal-outcome-dialog';

export const ScheduleDialog = ({ goal }: { goal: GoalWithAdditionalInfo }) => {
  const t = useTranslations('goals.scheduleDialog');
  const locale = useLocale();

  const [incomingOutcomes, passedOutcomes] = useMemo(
    () =>
      goal.goalBudgetOutcomes.reduce<
        [
          GoalWithAdditionalInfo['goalBudgetOutcomes'],
          GoalWithAdditionalInfo['goalBudgetOutcomes']
        ]
      >(
        (acc, outcome) => {
          if (outcome.status === GoalOutcomeStatus.COMPLETED) {
            return [acc[0], [...acc[1], outcome]];
          }

          return [[...acc[0], outcome], acc[1]];
        },
        [[], []]
      ),
    [goal.goalBudgetOutcomes]
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='sm'>
          <CalendarDays className='h-4 w-4' />
          {t('button')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title', { goalName: goal.name })}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        {incomingOutcomes.length > 0 && (
          <div className='flex flex-col gap-4'>
            <h2 className='text-lg font-bold'>{t('incomingOutcomes')}</h2>
            <ul className='flex flex-col gap-4'>
              {incomingOutcomes.map((outcome) => (
                <li key={outcome.id}>
                  <Card className='py-4! px-5! gap-3'>
                    <CardHeader className='px-0! flex flex-row justify-between'>
                      <div className='flex flex-col'>
                        <CardTitle className='text-md font-bold'>
                          {outcome.name}
                        </CardTitle>
                        <CardDescription className='text-xs font-medium text-primary/70'>
                          {format(outcome.date, 'd MMMM yyyy', {
                            locale: getDateFnsLocaleFromLanguage(
                              locale as Language
                            )
                          })}
                        </CardDescription>
                      </div>

                      <Badge
                        className={cn(
                          'text-xs',
                          outcome.status === GoalOutcomeStatus.COMPLETED &&
                            'bg-primary/60',
                          outcome.status ===
                            GoalOutcomeStatus.IN_CURRENT_BUDGET && 'bg-primary',
                          outcome.status === GoalOutcomeStatus.PLANNED &&
                            'bg-blue-600 text-white'
                        )}
                      >
                        {outcome.status === GoalOutcomeStatus.COMPLETED &&
                          t('past')}
                        {outcome.status ===
                          GoalOutcomeStatus.IN_CURRENT_BUDGET &&
                          t('currentBudget')}
                        {outcome.status === GoalOutcomeStatus.PLANNED &&
                          t('future')}
                      </Badge>
                    </CardHeader>
                    <CardContent className='px-0! flex flex-row items-center justify-between'>
                      <p className='text-xl font-bold'>
                        <FormattedCurrency valueCents={outcome.valueCents} />
                      </p>
                      {outcome.status !== GoalOutcomeStatus.PLANNED && (
                        <EditGoalOutcomeDialog
                          className='text-xs'
                          outcomeId={outcome.id}
                          valueCents={outcome.valueCents}
                        />
                      )}
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        )}
        {passedOutcomes.length > 0 && (
          <div className='flex flex-col gap-4'>
            <h2 className='mt-6 text-lg font-bold'>{t('passedOutcomes')}</h2>
            <ul className='flex flex-col gap-4'>
              {passedOutcomes.map((outcome) => (
                <li key={outcome.id}>
                  <Card className='py-4! px-5! gap-3'>
                    <CardHeader className='px-0! flex flex-row justify-between'>
                      <div className='flex flex-col'>
                        <CardTitle className='text-md font-bold'>
                          {outcome.name}
                        </CardTitle>
                        <CardDescription className='text-xs font-medium text-primary/70'>
                          {format(outcome.date, 'd MMMM yyyy', {
                            locale: getDateFnsLocaleFromLanguage(
                              locale as Language
                            )
                          })}
                        </CardDescription>
                      </div>

                      <Badge
                        className={cn(
                          'text-xs',
                          outcome.status === GoalOutcomeStatus.COMPLETED &&
                            'bg-primary/60',
                          outcome.status ===
                            GoalOutcomeStatus.IN_CURRENT_BUDGET && 'bg-primary',
                          outcome.status === GoalOutcomeStatus.PLANNED &&
                            'bg-blue-600 text-white'
                        )}
                      >
                        {outcome.status === GoalOutcomeStatus.COMPLETED &&
                          t('past')}
                        {outcome.status ===
                          GoalOutcomeStatus.IN_CURRENT_BUDGET &&
                          t('currentBudget')}
                        {outcome.status === GoalOutcomeStatus.PLANNED &&
                          t('future')}
                      </Badge>
                    </CardHeader>
                    <CardContent className='px-0! flex flex-row items-center justify-between'>
                      <p className='text-xl font-bold'>
                        <FormattedCurrency valueCents={outcome.valueCents} />
                      </p>
                      {outcome.status !== GoalOutcomeStatus.PLANNED && (
                        <EditGoalOutcomeDialog
                          className='text-xs'
                          outcomeId={outcome.id}
                          valueCents={outcome.valueCents}
                        />
                      )}
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
