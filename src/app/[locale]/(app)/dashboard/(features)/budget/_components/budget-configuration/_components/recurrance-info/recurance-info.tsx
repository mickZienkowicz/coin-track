import { Interval, RecurrenceType } from '@prisma/client';
import { Repeat } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { getIntervalLabel } from '@/lib/utils';

type ItemWithOccurenceInfo = {
  recurrence: RecurrenceType;
  repeatEvery: Interval | null;
  repeatCount: number | null;
  occurrenceCount: number;
  isDisabled: boolean;
};

const getRecurrenceText = (
  itemWithOccurenceInfo: ItemWithOccurenceInfo,
  t: ReturnType<typeof useTranslations>,
  recurringT: ReturnType<typeof useTranslations>
) => {
  if (itemWithOccurenceInfo.isDisabled) {
    return `${t('recurringDisabled', {
      count: itemWithOccurenceInfo.occurrenceCount,
      countLabel:
        itemWithOccurenceInfo.occurrenceCount === 1
          ? t('recurringDisabledCountLabel.one')
          : t('recurringDisabledCountLabel.other')
    })}`;
  }

  if (
    itemWithOccurenceInfo.recurrence === RecurrenceType.INFINITE &&
    itemWithOccurenceInfo.repeatEvery
  ) {
    return `${t('recurringInfinite', {
      interval: getIntervalLabel(itemWithOccurenceInfo.repeatEvery, recurringT)
    })}`;
  }

  if (
    itemWithOccurenceInfo.recurrence === RecurrenceType.MULTIPLE &&
    itemWithOccurenceInfo.repeatCount &&
    itemWithOccurenceInfo.repeatEvery
  ) {
    return `${t('recurringMultiple', {
      interval: getIntervalLabel(itemWithOccurenceInfo.repeatEvery, recurringT),
      count:
        itemWithOccurenceInfo.repeatCount -
        itemWithOccurenceInfo.occurrenceCount
    })}`;
  }

  return t('recurringOutcome');
};

export const RecuranceInfo = ({
  itemWithOccurenceInfo
}: {
  itemWithOccurenceInfo: ItemWithOccurenceInfo;
}) => {
  const t = useTranslations('budget.outcomes.outcomeCard');
  const recurringT = useTranslations('recurring');

  if (itemWithOccurenceInfo.recurrence === RecurrenceType.ONE_TIME) {
    return null;
  }

  return (
    <div className='flex items-center rounded-full bg-blue-50 px-3 py-1'>
      <Repeat className='mr-1.5 h-3.5 w-3.5 text-blue-500' />
      <span className='text-xs font-medium text-blue-700'>
        {getRecurrenceText(itemWithOccurenceInfo, t, recurringT)}
      </span>
    </div>
  );
};
