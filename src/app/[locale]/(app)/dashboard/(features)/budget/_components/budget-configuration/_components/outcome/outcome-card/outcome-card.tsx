import Link from 'next/link';
import { RecurrenceType } from '@prisma/client';
import { format } from 'date-fns';
import {
  ArrowDownCircle,
  Ban,
  Calendar,
  CheckCircle2,
  Clock,
  TargetIcon
} from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';

import { FormattedCurrency } from '@/app/[locale]/(app)/dashboard/_components/formatted-currency/formatted-currency';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import { Language } from '@/i18n/routing';
import { OutcomeWithOccurenceInfo } from '@/lib/dates/get-next-occurance/types';
import { getDateFnsLocaleFromLanguage } from '@/lib/locale/get-date-fns-locale-from-language';
import { pathGenerators } from '@/lib/paths';
import { cn } from '@/lib/utils';

import { RecuranceInfo } from '../../recurrance-info/recurance-info';
import { EditOutcomeDialog } from '../edit-outcome/edit-outcome-dialog';
import { RemoveOutcomeDialog } from '../remove-outcome/remove-income-dialog';
import { StopOutcomeDialog } from '../stop-outcome/stop-outcome-dialog';
import { CategoryBadge } from './components/category-badge';

export const OutcomeCard = async ({
  outcome
}: {
  outcome: OutcomeWithOccurenceInfo;
}) => {
  const [t, locale] = await Promise.all([
    getTranslations('budget.outcomes.outcomeCard'),
    getLocale()
  ]);

  return (
    <Card className='pb-4! w-full' data-tour='outcome-card'>
      {outcome.isFinished && (
        <Badge
          variant='outline'
          className='mx-6 -mb-2 h-auto border-gray-200 bg-gray-100 py-1 text-gray-800'
        >
          <CheckCircle2 className='size-4! mr-1' />
          {t('finishedBadge')}
        </Badge>
      )}
      {outcome.isStopped && (
        <Badge
          variant='outline'
          className='mx-6 -mb-2 h-auto border-gray-200 bg-gray-100 py-1 text-gray-800'
        >
          <Ban className='size-4! mr-1' />
          {t('stoppedBadge')}
        </Badge>
      )}
      <CardHeader
        className={cn(
          outcome.isDisabled && 'opacity-30',
          'mb-2 flex items-start justify-between gap-4'
        )}
      >
        <div className='flex w-full flex-col gap-1.5'>
          <div className='flex w-full items-center justify-between gap-3'>
            <h3 className='overflow-hidden text-ellipsis break-words text-xl font-semibold'>
              {outcome.name}
            </h3>
            <CategoryBadge category={outcome.category} />
          </div>
          <p className='text-sm text-primary/70'>
            <Calendar className='-mt-0.5 mr-1 inline-block h-3.5 w-3.5' />
            {outcome.isDisabled &&
              outcome.lastOccurrenceDate &&
              `${outcome.recurrence !== RecurrenceType.ONE_TIME ? t('lastOccurrenceDatePrefix') : ''}${format(
                outcome.lastOccurrenceDate,
                'dd MMMM yyyy',
                {
                  locale: getDateFnsLocaleFromLanguage(locale as Language)
                }
              )}`}

            {!outcome.isDisabled &&
              outcome.nextOccurrenceDate &&
              `${outcome.recurrence !== RecurrenceType.ONE_TIME ? t('nextOccurrenceDatePrefix') : ''}${format(
                outcome.nextOccurrenceDate,
                'dd MMMM yyyy',
                {
                  locale: getDateFnsLocaleFromLanguage(locale as Language)
                }
              )}`}
          </p>
        </div>
      </CardHeader>
      <CardContent
        className={cn(
          outcome.isDisabled && 'opacity-30',
          'flex flex-col gap-4'
        )}
      >
        <div className='@md:flex-row @md:items-center @md:gap-2 flex flex-col justify-between gap-4'>
          <div className='flex items-center'>
            <div className='mr-3 flex size-12 items-center justify-center rounded-full bg-red-600/10'>
              <ArrowDownCircle className='size-6 text-red-600' />
            </div>
            <div>
              <p className='text-sm font-medium text-primary/70'>
                {t('amount')}
              </p>
              <p className='text-2xl font-bold'>
                <FormattedCurrency valueCents={outcome.valueCents} />
              </p>
            </div>
          </div>

          <div className='@md:order-1 -order-1 flex items-center'>
            {outcome.recurrence !== RecurrenceType.ONE_TIME ? (
              <RecuranceInfo itemWithOccurenceInfo={outcome} />
            ) : (
              <div className='flex items-center rounded-full bg-gray-100 px-3 py-1'>
                <Clock className='mr-1.5 h-3.5 w-3.5 text-gray-500' />
                <span className='text-xs font-medium text-gray-700'>
                  {t('oneTime')}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className='pt-4! flex w-full items-center justify-end gap-4 border-t border-sidebar-border'>
        {outcome.goalId ? (
          <div className='flex w-full items-center justify-between gap-4'>
            <p className='text-start text-sm text-primary/70'>
              {t('goalOutcomeChangeInfo')}
            </p>
            <Link
              href={pathGenerators.goals()}
              className={cn(buttonVariants({ size: 'sm' }))}
            >
              <TargetIcon className='size-3.5' />
              {t('goToGoals')}
            </Link>
          </div>
        ) : (
          <>
            <EditOutcomeDialog outcome={outcome} />
            {outcome.isDisabled ||
            outcome.recurrence === RecurrenceType.ONE_TIME ? (
              <RemoveOutcomeDialog
                outcomeId={outcome.id}
                isOneTime={outcome.recurrence === RecurrenceType.ONE_TIME}
              />
            ) : (
              <StopOutcomeDialog outcome={outcome} />
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};
