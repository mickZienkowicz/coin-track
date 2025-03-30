import { RecurrenceType } from '@prisma/client';
import { Repeat } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { PouchWithOccurenceInfo } from '@/lib/dates/get-next-occurance/types';
import { getIntervalLabel } from '@/lib/utils';

const getRecurrenceText = (
  pouch: PouchWithOccurenceInfo,
  t: ReturnType<typeof useTranslations>
) => {
  if (pouch.isDisabled) {
    return `${t('recurringDisabled', {
      count: pouch.occurrenceCount,
      countLabel:
        pouch.occurrenceCount === 1
          ? t('recurringDisabledCountLabel.one')
          : t('recurringDisabledCountLabel.other')
    })}`;
  }

  if (pouch.recurrence === RecurrenceType.INFINITE && pouch.repeatEvery) {
    return `${t('recurringInfinite', {
      interval: getIntervalLabel(pouch.repeatEvery)
    })}`;
  }

  if (
    pouch.recurrence === RecurrenceType.MULTIPLE &&
    pouch.repeatCount &&
    pouch.repeatEvery
  ) {
    return `${t('recurringMultiple', {
      interval: getIntervalLabel(pouch.repeatEvery),
      count: pouch.repeatCount - pouch.occurrenceCount
    })}`;
  }

  return t('recurring');
};

export const RecuranceInfo = ({ pouch }: { pouch: PouchWithOccurenceInfo }) => {
  const t = useTranslations('budget.pouch.pouchCard');

  if (pouch.recurrence === RecurrenceType.ONE_TIME) {
    return null;
  }

  return (
    <div className='mt-2 flex items-center text-sm text-muted-foreground'>
      <Repeat className='mr-2 h-4 w-4 text-blue-500' />
      <span>{getRecurrenceText(pouch, t)}</span>
    </div>
  );
};
