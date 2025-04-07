import { RecurrenceType } from '@prisma/client';
import { Repeat } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { OutcomeWithOccurenceInfo } from '@/lib/dates/get-next-occurance/types';
import { getIntervalLabel } from '@/lib/utils';

const getRecurrenceText = (
  outcome: OutcomeWithOccurenceInfo,
  t: ReturnType<typeof useTranslations>
) => {
  if (outcome.isDisabled) {
    return `${t('recurringDisabled', {
      count: outcome.occurrenceCount,
      countLabel:
        outcome.occurrenceCount === 1
          ? t('recurringDisabledCountLabel.one')
          : t('recurringDisabledCountLabel.other')
    })}`;
  }

  if (outcome.recurrence === RecurrenceType.INFINITE && outcome.repeatEvery) {
    return `${t('recurringInfinite', {
      interval: getIntervalLabel(outcome.repeatEvery)
    })}`;
  }

  if (
    outcome.recurrence === RecurrenceType.MULTIPLE &&
    outcome.repeatCount &&
    outcome.repeatEvery
  ) {
    return `${t('recurringMultiple', {
      interval: getIntervalLabel(outcome.repeatEvery),
      count: outcome.repeatCount - outcome.occurrenceCount
    })}`;
  }

  return t('recurringOutcome');
};

export const RecuranceInfo = ({
  outcome
}: {
  outcome: OutcomeWithOccurenceInfo;
}) => {
  const t = useTranslations('budget.outcomes.outcomeCard');
  if (outcome.recurrence === RecurrenceType.ONE_TIME) {
    return null;
  }

  return (
    <div className='mt-2 flex items-center text-sm text-muted-foreground'>
      <Repeat className='mr-2 h-4 w-4 text-blue-500' />
      <span>{getRecurrenceText(outcome, t)}</span>
    </div>
  );
};
