import { Interval, RecurrenceType } from '@prisma/client';
import { isAfter } from 'date-fns';

import { getUtcMiddayDateOfGivenDate } from '@/lib/dates/get-utc-midday-date-of-given-date';
import { getDateOneIntervalBefore } from '@/lib/dates/utils/get-date-one-interval-before';

import { getOccurancesAmounts } from '../get-occurances-amounts';

export const getGoalOutcomes = async ({
  goalName,
  startDate,
  endDate,
  savingInterval,
  missingAmount
}: {
  goalName: string;
  startDate: Date;
  endDate: Date;
  savingInterval: Interval;
  missingAmount: number;
}) => {
  const utcStart = getUtcMiddayDateOfGivenDate(startDate);
  let outcomes = [];
  let goalsCount = 0;
  let tempDate = getUtcMiddayDateOfGivenDate(endDate);

  while (isAfter(tempDate, utcStart)) {
    outcomes.push({
      name: goalName,
      valueCents: 0,
      date: tempDate,
      category: 'goals',
      recurrence: RecurrenceType.ONE_TIME as RecurrenceType
    });

    goalsCount++;
    tempDate = getDateOneIntervalBefore({
      date: tempDate,
      interval: savingInterval
    });
  }

  const { regularAmount, lastAmount } = getOccurancesAmounts(
    missingAmount,
    goalsCount
  );

  return outcomes.map((outcome, index) => ({
    ...outcome,
    valueCents: index === outcomes.length - 1 ? lastAmount : regularAmount
  }));
};
