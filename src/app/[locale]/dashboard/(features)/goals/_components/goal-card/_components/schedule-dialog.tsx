import { Goal, Outcome } from '@prisma/client';
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

import { EditGoalOutcomeDialog } from '../../edit-goal-outcome/edit-goal-outcome-dialog';

export const ScheduleDialog = ({
  goal
}: {
  goal: Goal & { goalBudgetOutcomes: (Outcome & { timeBadge: string })[] };
}) => {
  const t = useTranslations('goals.scheduleDialog');
  const locale = useLocale();

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
        {goal.goalBudgetOutcomes.length > 0 && (
          <ul className='flex flex-col gap-4'>
            {goal.goalBudgetOutcomes.map((outcome) => (
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
                        outcome.timeBadge === 'past' && 'bg-primary/60',
                        outcome.timeBadge === 'future' && 'bg-primary',
                        outcome.timeBadge === 'currentBudget' &&
                          'bg-blue-600 text-white'
                      )}
                    >
                      {outcome.timeBadge === 'past' && t('past')}
                      {outcome.timeBadge === 'future' && t('future')}
                      {outcome.timeBadge === 'currentBudget' &&
                        t('currentBudget')}
                    </Badge>
                  </CardHeader>
                  <CardContent className='px-0! flex flex-row items-center justify-between'>
                    <p className='text-xl font-bold'>
                      <FormattedCurrency valueCents={outcome.valueCents} />
                    </p>
                    {outcome.timeBadge !== 'future' && (
                      <EditGoalOutcomeDialog className='text-xs' />
                    )}
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
};
