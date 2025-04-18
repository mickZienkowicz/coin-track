import { Interval, RecurrenceType } from '@prisma/client';
import { isAfter, isBefore, isEqual } from 'date-fns';

import { getUtcMiddayDateOfGivenDate } from '../get-utc-midday-date-of-given-date';
import { getDateOneIntervalAfter } from '../utils/get-date-one-interval-after';
import { GetOccurrenceInfoArgs, GetOccurrenceInfoResult } from './types';

export const getOccurenceInfo = ({
  firstOccurrenceDate,
  recurrence,
  interval,
  repeatCount,
  stoppedAt,
  today,
  currentBudgetStartDate
}: GetOccurrenceInfoArgs): GetOccurrenceInfoResult => {
  const UTCMiddayToday = getUtcMiddayDateOfGivenDate(today);

  if (recurrence === RecurrenceType.ONE_TIME || !interval) {
    const isFinished = isBefore(firstOccurrenceDate, currentBudgetStartDate);

    return {
      nextOccurrenceDate: isFinished ? null : firstOccurrenceDate,
      lastOccurrenceDate: isFinished ? firstOccurrenceDate : null,
      nextOccurrenceCount: 1,
      occurrenceCount: isFinished ? 1 : 0,
      isFinished,
      isStopped: false,
      isDisabled: isFinished
    };
  }

  // Event is stopped before it has started.
  if (stoppedAt && isBefore(stoppedAt, firstOccurrenceDate)) {
    return {
      nextOccurrenceDate: null,
      nextOccurrenceCount: 0,
      lastOccurrenceDate: null,
      occurrenceCount: 0,
      isFinished: true,
      isStopped: false,
      isDisabled: true
    };
  }

  // Event has not occured yet
  if (isAfter(firstOccurrenceDate, UTCMiddayToday)) {
    return {
      nextOccurrenceDate: firstOccurrenceDate,
      nextOccurrenceCount: 1,
      lastOccurrenceDate: null,
      occurrenceCount: 0,
      isFinished: false,
      isStopped: false,
      isDisabled: false
    };
  }

  return recursivelyGetOccurrenceInfo({
    date: firstOccurrenceDate,
    interval,
    maxCounts: repeatCount,
    today: UTCMiddayToday,
    stoppedAt
  });
};

const recursivelyGetOccurrenceInfo = ({
  date,
  interval,
  maxCounts,
  currentCount = 1,
  today,
  stoppedAt
}: {
  date: Date;
  interval: Interval;
  maxCounts: number | null;
  currentCount?: number;
  today: Date;
  stoppedAt: Date | null;
}): GetOccurrenceInfoResult => {
  const nextOccurrenceDate = getUtcMiddayDateOfGivenDate(
    getDateOneIntervalAfter({
      date,
      interval
    })
  );

  // Stopped today and no next occurance
  if (stoppedAt && isEqual(nextOccurrenceDate, stoppedAt)) {
    return {
      nextOccurrenceDate: null,
      nextOccurrenceCount: currentCount,
      lastOccurrenceDate: date,
      occurrenceCount: currentCount,
      isFinished: false,
      isStopped: true,
      isDisabled: true
    };
  }

  //Stppped before the next occurance
  if (stoppedAt && isAfter(nextOccurrenceDate, stoppedAt)) {
    return {
      nextOccurrenceDate: null,
      nextOccurrenceCount: currentCount,
      lastOccurrenceDate: date,
      occurrenceCount: currentCount,
      isFinished: false,
      isStopped: true,
      isDisabled: true
    };
  }

  // Finished and no next occurance
  if (maxCounts && currentCount >= maxCounts) {
    return {
      nextOccurrenceDate: null,
      nextOccurrenceCount: currentCount,
      lastOccurrenceDate: date,
      occurrenceCount: currentCount,
      isFinished: true,
      isStopped: false,
      isDisabled: true
    };
  }

  // Next occurance is in the future
  if (isAfter(nextOccurrenceDate, today)) {
    return {
      nextOccurrenceDate: nextOccurrenceDate,
      nextOccurrenceCount: currentCount + 1,
      lastOccurrenceDate: date,
      occurrenceCount: currentCount,
      isFinished: false,
      isStopped: false,
      isDisabled: false
    };
  }

  return recursivelyGetOccurrenceInfo({
    date: nextOccurrenceDate,
    interval,
    maxCounts,
    currentCount: currentCount + 1,
    today,
    stoppedAt
  });
};
