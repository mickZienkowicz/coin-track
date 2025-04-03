import { RecurrenceType } from '@prisma/client';
import { format } from 'date-fns';
import {
  ArrowDownCircle,
  Ban,
  Calendar,
  CheckCircle2,
  Clock,
  RefreshCw
} from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import { Language } from '@/i18n/routing';
import { formatCurrency } from '@/lib/currencies';
import { OutcomeWithOccurenceInfo } from '@/lib/dates/get-next-occurance/types';
import { getDateFnsLocaleFromLanguage } from '@/lib/locale/get-date-fns-locale-from-language';
import { cn } from '@/lib/utils';

import { EditOutcomeDialog } from '../edit-outcome/edit-outcome-dialog';
import { RemoveOutcomeDialog } from '../remove-outcome/remove-income-dialog';
import { StopOutcomeDialog } from '../stop-outcome/stop-outcome-dialog';
import { CategoryBadge } from './components/category-badge';
import { RecuranceInfo } from './components/recurance-info';

export const OutcomeCard = async ({
  outcome,
  currency
}: {
  outcome: OutcomeWithOccurenceInfo;
  currency: string;
}) => {
  const [t, locale] = await Promise.all([
    getTranslations('budget.outcomes.outcomeCard'),
    getLocale()
  ]);

  return (
    <Card className='pb-4! w-full'>
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
          outcome.isDisabled && 'opacity-20',
          'mb-2 flex items-start justify-between gap-4'
        )}
      >
        <div className='flex w-full flex-col gap-1.5'>
          <div className='flex w-full justify-between gap-1.5'>
            <h3 className='text-xl font-semibold'>{outcome.name}</h3>
            <CategoryBadge category={outcome.category} />
          </div>
          <p className='text-sm text-muted-foreground'>
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
          outcome.isDisabled && 'opacity-20',
          'flex flex-col gap-4'
        )}
      >
        <div className='@md:flex-row @md:items-center @md:gap-2 flex flex-col justify-between gap-4'>
          <div className='flex items-center'>
            <div className='mr-3 flex size-12 items-center justify-center rounded-full bg-red-600/10'>
              <ArrowDownCircle className='size-6 text-red-600' />
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                {t('amount')}
              </p>
              <p className='text-2xl font-bold'>
                {formatCurrency({
                  cents: outcome.valueCents,
                  currency,
                  language: locale as Language
                })}
              </p>
            </div>
          </div>

          <div className='@md:order-1 -order-1 flex items-center'>
            {outcome.recurrence !== RecurrenceType.ONE_TIME ? (
              <div className='flex items-center rounded-full bg-blue-50 px-3 py-1'>
                <RefreshCw className='mr-1.5 h-3.5 w-3.5 text-blue-500' />
                <span className='text-xs font-medium text-blue-700'>
                  {t('recurring')}
                </span>
              </div>
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
        <RecuranceInfo outcome={outcome} />
      </CardContent>

      <CardFooter className='pt-4! flex w-full items-center justify-end gap-4 border-t border-sidebar-border'>
        <EditOutcomeDialog outcome={outcome} currency={currency} />
        {outcome.isDisabled ||
        outcome.recurrence === RecurrenceType.ONE_TIME ? (
          <RemoveOutcomeDialog
            outcomeId={outcome.id}
            isOneTime={outcome.recurrence === RecurrenceType.ONE_TIME}
          />
        ) : (
          <StopOutcomeDialog outcome={outcome} />
        )}
      </CardFooter>
    </Card>
  );
};
