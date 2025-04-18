import { RecurrenceType } from '@prisma/client';
import { format } from 'date-fns';
import { Ban, Calendar, CheckCircle2, Clock, ShoppingCart } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';

import { FormattedCurrency } from '@/app/[locale]/dashboard/_components/formatted-currency/formatted-currency';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import { Language } from '@/i18n/routing';
import { PouchWithOccurenceInfo } from '@/lib/dates/get-next-occurance/types';
import { getDateFnsLocaleFromLanguage } from '@/lib/locale/get-date-fns-locale-from-language';
import { cn } from '@/lib/utils';

import { RecuranceInfo } from '../../recurrance-info';
import { EditPouchDialog } from '../edit-pouch/edit-pouch-dialog';
import { RemovePouchDialog } from '../remove-pouch/remove-pouch-dialog';
import { StopPouchDialog } from '../stop-pouch/stop-pouch-dialog';
import { CategoryBadge } from './components/category-badge';

export const PouchCard = async ({
  pouch
}: {
  pouch: PouchWithOccurenceInfo;
}) => {
  const [t, locale] = await Promise.all([
    getTranslations('budget.pouch.pouchCard'),
    getLocale()
  ]);

  return (
    <Card className='pb-4! w-full'>
      {pouch.isFinished && (
        <Badge
          variant='outline'
          className='mx-6 -mb-2 h-auto border-gray-200 bg-gray-100 py-1 text-gray-800'
        >
          <CheckCircle2 className='size-4! mr-1' />
          {t('finishedBadge')}
        </Badge>
      )}
      {pouch.isStopped && (
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
          pouch.isDisabled && 'opacity-30',
          'mb-2 flex items-start justify-between gap-4'
        )}
      >
        <div className='flex w-full flex-col gap-1.5'>
          <div className='flex w-full items-center justify-between gap-3'>
            <h3 className='overflow-hidden text-ellipsis break-words text-xl font-semibold'>
              {pouch.name}
            </h3>
            <CategoryBadge category={pouch.category} />
          </div>
          <p className='text-sm text-primary/70'>
            <Calendar className='-mt-0.5 mr-1 inline-block h-3.5 w-3.5' />
            {pouch.isDisabled &&
              pouch.lastOccurrenceDate &&
              `${pouch.recurrence !== RecurrenceType.ONE_TIME ? 'Ostatni: ' : ''}${format(
                pouch.lastOccurrenceDate,
                'dd MMMM yyyy',
                {
                  locale: getDateFnsLocaleFromLanguage(locale as Language)
                }
              )}`}

            {!pouch.isDisabled &&
              pouch.nextOccurrenceDate &&
              `${pouch.recurrence !== RecurrenceType.ONE_TIME ? 'Następny: ' : ''}${format(
                pouch.nextOccurrenceDate,
                'dd MMMM yyyy',
                {
                  locale: getDateFnsLocaleFromLanguage(locale as Language)
                }
              )}`}
          </p>
        </div>
      </CardHeader>
      <CardContent
        className={cn(pouch.isDisabled && 'opacity-30', 'flex flex-col gap-4')}
      >
        <div className='@md:flex-row @md:items-center @md:gap-2 flex flex-col justify-between gap-4'>
          <div className='flex items-center'>
            <div className='mr-3 flex size-12 items-center justify-center rounded-full bg-blue-600/10'>
              <ShoppingCart className='size-6 text-blue-600' />
            </div>
            <div>
              <p className='text-sm font-medium text-primary/70'>
                {t('amount')}
              </p>
              <p className='text-2xl font-bold'>
                <FormattedCurrency valueCents={pouch.valueCents} />
              </p>
            </div>
          </div>

          <div className='@md:order-1 -order-1 flex items-center'>
            {pouch.recurrence !== RecurrenceType.ONE_TIME ? (
              <RecuranceInfo itemWithOccurenceInfo={pouch} />
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
        <EditPouchDialog pouch={pouch} />
        {pouch.isDisabled || pouch.recurrence === RecurrenceType.ONE_TIME ? (
          <RemovePouchDialog pouchId={pouch.id} isOneTime />
        ) : (
          <StopPouchDialog pouch={pouch} />
        )}
      </CardFooter>
    </Card>
  );
};
