import { Interval, RecurrenceType } from '@prisma/client';
import { addDays, isAfter, isBefore, isWithinInterval } from 'date-fns';

import { getUtcMiddayDateOfGivenDate } from '../get-utc-midday-date-of-given-date';
import { getDateOneIntervalAfter } from '../utils/get-date-one-interval-after';

interface RecurringItem {
  id: string;
  date: Date;
  recurrence: RecurrenceType;
  repeatCount?: number | null;
  repeatEvery?: Interval | null;
  stoppedAt?: Date | null;
}

type WithOccurrences<T> = T & {
  occurrences: Date[];
};

export const getOccurrencesInTimeframe = <T extends RecurringItem>(
  startDate: Date,
  endDate: Date,
  items: T[]
): WithOccurrences<T>[] => {
  const adjustedEndDate = addDays(endDate, 1);

  return items
    .map((item) => {
      const occurrences: Date[] = [];

      // Handle ONE_TIME incomes
      if (item.recurrence === RecurrenceType.ONE_TIME) {
        if (
          isWithinInterval(item.date, {
            start: startDate,
            end: adjustedEndDate
          }) &&
          (!item.stoppedAt || isBefore(item.date, item.stoppedAt))
        ) {
          occurrences.push(getUtcMiddayDateOfGivenDate(new Date(item.date)));
        }
        return { ...item, occurrences };
      }

      // Handle MULTIPLE and INFINITE recurrences
      if (!item.repeatEvery) {
        return { ...item, occurrences };
      }

      let currentDate = getUtcMiddayDateOfGivenDate(new Date(item.date));
      let occurrenceCount = 1;

      while (isBefore(currentDate, adjustedEndDate)) {
        if (
          isWithinInterval(currentDate, {
            start: startDate,
            end: adjustedEndDate
          }) &&
          (!item.stoppedAt || isBefore(currentDate, item.stoppedAt))
        ) {
          occurrences.push(getUtcMiddayDateOfGivenDate(new Date(currentDate)));
        }

        // Break conditions
        if (
          item.recurrence === RecurrenceType.MULTIPLE &&
          item.repeatCount &&
          occurrenceCount >= item.repeatCount
        ) {
          break;
        }

        if (item.stoppedAt && isAfter(currentDate, item.stoppedAt)) {
          break;
        }

        currentDate = getDateOneIntervalAfter({
          date: currentDate,
          interval: item.repeatEvery
        });
        occurrenceCount++;
      }

      return {
        ...item,
        occurrences
      };
    })
    .filter((item) => item.occurrences.length > 0);
};
