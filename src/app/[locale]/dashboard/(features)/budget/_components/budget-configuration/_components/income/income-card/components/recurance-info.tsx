import { RecurrenceType } from '@prisma/client';
import { Repeat } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { IncomeWithOccurenceInfo } from '@/lib/dates/get-next-occurance/types';
import { getIntervalLabel } from '@/lib/utils';

const getRecurrenceText = (
  income: IncomeWithOccurenceInfo,
  t: ReturnType<typeof useTranslations>
) => {
  if (income.isDisabled) {
    return `${t('recurringDisabled', {
      count: income.occurrenceCount,
      countLabel:
        income.occurrenceCount === 1
          ? t('recurringDisabledCountLabel.one')
          : t('recurringDisabledCountLabel.other')
    })}`;
  }

  if (income.recurrence === RecurrenceType.INFINITE && income.repeatEvery) {
    return `${t('recurringInfinite', {
      interval: getIntervalLabel(income.repeatEvery)
    })}`;
  }

  if (
    income.recurrence === RecurrenceType.MULTIPLE &&
    income.repeatCount &&
    income.repeatEvery
  ) {
    return `${t('recurringMultiple', {
      interval: getIntervalLabel(income.repeatEvery),
      count: income.repeatCount - income.occurrenceCount
    })}`;
  }

  return t('recurringIncome');
};

export const RecuranceInfo = ({
  income
}: {
  income: IncomeWithOccurenceInfo;
}) => {
  const t = useTranslations('budget.incomes.incomeCard');

  if (income.recurrence === RecurrenceType.ONE_TIME) {
    return null;
  }

  return (
    <div className='mt-2 flex items-center text-sm text-muted-foreground'>
      <Repeat className='mr-2 h-4 w-4 text-blue-500' />
      <span>{getRecurrenceText(income, t)}</span>
    </div>
  );
};
