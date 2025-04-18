import { Interval, RecurrenceType } from '@prisma/client';
import { addDays, addMonths, addWeeks, subDays } from 'date-fns';
import { describe, expect, it } from 'vitest';

import { getUtcMiddayDateOfGivenDate } from '../get-utc-midday-date-of-given-date';
import { getOccurenceInfo } from './get-occurance-info';
import { GetOccurrenceInfoArgs } from './types';

const today = getUtcMiddayDateOfGivenDate(new Date('2023-10-10'));
describe('getOccurenceInfo', () => {
  it('should handle one-time events that occurred in the past', () => {
    const args: GetOccurrenceInfoArgs = {
      firstOccurrenceDate: getUtcMiddayDateOfGivenDate(new Date('2023-10-01')),
      recurrence: RecurrenceType.ONE_TIME,
      interval: Interval.DAY,
      repeatCount: 1,
      stoppedAt: null,
      today,
      currentBudgetStartDate: subDays(today, 1)
    };
    const result = getOccurenceInfo(args);
    expect(result).toEqual({
      nextOccurrenceDate: null,
      lastOccurrenceDate: args.firstOccurrenceDate,
      nextOccurrenceCount: 1,
      occurrenceCount: 1,
      isFinished: true,
      isStopped: false,
      isDisabled: true
    });
  });

  it('should handle one-time events scheduled for the future', () => {
    const args: GetOccurrenceInfoArgs = {
      firstOccurrenceDate: addDays(today, 1),
      recurrence: RecurrenceType.ONE_TIME,
      interval: Interval.DAY,
      repeatCount: 1,
      stoppedAt: null,
      today,
      currentBudgetStartDate: subDays(today, 1)
    };
    const result = getOccurenceInfo(args);
    expect(result).toEqual({
      nextOccurrenceDate: args.firstOccurrenceDate,
      lastOccurrenceDate: null,
      nextOccurrenceCount: 1,
      occurrenceCount: 0,
      isFinished: false,
      isStopped: false,
      isDisabled: false
    });
  });

  it('should handle daily recurring events that have not yet started', () => {
    const args: GetOccurrenceInfoArgs = {
      firstOccurrenceDate: addDays(today, 1),
      recurrence: RecurrenceType.MULTIPLE,
      interval: Interval.DAY,
      repeatCount: 5,
      stoppedAt: null,
      today,
      currentBudgetStartDate: subDays(today, 1)
    };
    const result = getOccurenceInfo(args);
    expect(result).toEqual({
      nextOccurrenceDate: addDays(today, 1),
      lastOccurrenceDate: null,
      nextOccurrenceCount: 1,
      occurrenceCount: 0,
      isFinished: false,
      isStopped: false,
      isDisabled: false
    });
  });

  it('should handle daily recurring events that are ongoing', () => {
    const args: GetOccurrenceInfoArgs = {
      firstOccurrenceDate: getUtcMiddayDateOfGivenDate(new Date('2023-10-02')),
      recurrence: RecurrenceType.MULTIPLE,
      interval: Interval.DAY,
      repeatCount: 10,
      stoppedAt: null,
      today,
      currentBudgetStartDate: subDays(today, 1)
    };
    const result = getOccurenceInfo(args);
    expect(result).toEqual({
      nextOccurrenceDate: addDays(today, 1),
      lastOccurrenceDate: today,
      nextOccurrenceCount: 10,
      occurrenceCount: 9,
      isFinished: false,
      isStopped: false,
      isDisabled: false
    });
  });

  it('should handle weekly recurring events that have been stopped', () => {
    const args: GetOccurrenceInfoArgs = {
      firstOccurrenceDate: getUtcMiddayDateOfGivenDate(new Date('2023-09-15')),
      recurrence: RecurrenceType.MULTIPLE,
      interval: Interval.WEEK,
      repeatCount: 10,
      stoppedAt: getUtcMiddayDateOfGivenDate(new Date('2023-10-05')),
      today,
      currentBudgetStartDate: subDays(today, 1)
    };
    const result = getOccurenceInfo(args);
    expect(result).toEqual({
      nextOccurrenceDate: null,
      lastOccurrenceDate: getUtcMiddayDateOfGivenDate(new Date('2023-09-29')),
      nextOccurrenceCount: 3,
      occurrenceCount: 3,
      isFinished: false,
      isStopped: true,
      isDisabled: true
    });
  });

  it('should handle monthly recurring events that have finished', () => {
    const args: GetOccurrenceInfoArgs = {
      firstOccurrenceDate: getUtcMiddayDateOfGivenDate(new Date('2023-06-01')),
      recurrence: RecurrenceType.MULTIPLE,
      interval: Interval.MONTH,
      repeatCount: 5,
      stoppedAt: null,
      today,
      currentBudgetStartDate: subDays(today, 1)
    };
    const result = getOccurenceInfo(args);
    expect(result).toEqual({
      nextOccurrenceDate: null,
      lastOccurrenceDate: getUtcMiddayDateOfGivenDate(new Date('2023-10-01')),
      nextOccurrenceCount: 5,
      occurrenceCount: 5,
      isFinished: true,
      isStopped: false,
      isDisabled: true
    });
  });

  it('should handle infinite daily recurrence', () => {
    const args: GetOccurrenceInfoArgs = {
      firstOccurrenceDate: getUtcMiddayDateOfGivenDate(new Date('2023-10-01')),
      recurrence: RecurrenceType.INFINITE,
      interval: Interval.DAY,
      repeatCount: null,
      stoppedAt: null,
      today,
      currentBudgetStartDate: subDays(today, 1)
    };
    const result = getOccurenceInfo(args);
    expect(result).toEqual({
      nextOccurrenceDate: addDays(today, 1),
      lastOccurrenceDate: today,
      nextOccurrenceCount: 11,
      occurrenceCount: 10,
      isFinished: false,
      isStopped: false,
      isDisabled: false
    });
  });

  it("should handle events stopped on today's date", () => {
    const args: GetOccurrenceInfoArgs = {
      firstOccurrenceDate: getUtcMiddayDateOfGivenDate(new Date('2023-10-05')),
      recurrence: RecurrenceType.INFINITE,
      interval: Interval.DAY,
      repeatCount: null,
      stoppedAt: today,
      today,
      currentBudgetStartDate: subDays(today, 1)
    };
    const result = getOccurenceInfo(args);
    expect(result).toEqual({
      nextOccurrenceDate: null,
      lastOccurrenceDate: getUtcMiddayDateOfGivenDate(new Date('2023-10-09')),
      nextOccurrenceCount: 5,
      occurrenceCount: 5,
      isFinished: false,
      isStopped: true,
      isDisabled: true
    });
  });

  it('should handle weekly events that are stopped', () => {
    const args: GetOccurrenceInfoArgs = {
      firstOccurrenceDate: getUtcMiddayDateOfGivenDate(new Date('2023-09-24')),
      recurrence: RecurrenceType.INFINITE,
      interval: Interval.WEEK,
      repeatCount: null,
      stoppedAt: getUtcMiddayDateOfGivenDate(new Date('2023-10-02')),
      today,
      currentBudgetStartDate: subDays(today, 1)
    };
    const result = getOccurenceInfo(args);
    expect(result).toEqual({
      nextOccurrenceDate: null,
      lastOccurrenceDate: getUtcMiddayDateOfGivenDate(new Date('2023-10-01')),
      nextOccurrenceCount: 2,
      occurrenceCount: 2,
      isFinished: false,
      isStopped: true,
      isDisabled: true
    });
  });

  it('should handle events one day before the next interval', () => {
    const args: GetOccurrenceInfoArgs = {
      firstOccurrenceDate: getUtcMiddayDateOfGivenDate(new Date('2023-09-27')),
      recurrence: RecurrenceType.MULTIPLE,
      interval: Interval.WEEK,
      repeatCount: 3,
      stoppedAt: null,
      today,
      currentBudgetStartDate: subDays(today, 1)
    };
    const result = getOccurenceInfo(args);
    expect(result).toEqual({
      nextOccurrenceDate: addDays(today, 1),
      lastOccurrenceDate: addWeeks(
        getUtcMiddayDateOfGivenDate(new Date('2023-09-27')),
        1
      ),
      nextOccurrenceCount: 3,
      occurrenceCount: 2,
      isFinished: false,
      isStopped: false,
      isDisabled: false
    });
  });

  it('should handle events on the day of the next interval', () => {
    const args: GetOccurrenceInfoArgs = {
      firstOccurrenceDate: today,
      recurrence: RecurrenceType.MULTIPLE,
      interval: Interval.DAY,
      repeatCount: 3,
      stoppedAt: null,
      today,
      currentBudgetStartDate: subDays(today, 1)
    };
    const result = getOccurenceInfo(args);
    expect(result).toEqual({
      nextOccurrenceDate: addDays(today, 1),
      lastOccurrenceDate: today,
      nextOccurrenceCount: 2,
      occurrenceCount: 1,
      isFinished: false,
      isStopped: false,
      isDisabled: false
    });
  });

  it('should handle events one day after the next interval', () => {
    const args: GetOccurrenceInfoArgs = {
      firstOccurrenceDate: getUtcMiddayDateOfGivenDate(new Date('2023-10-08')),
      recurrence: RecurrenceType.MULTIPLE,
      interval: Interval.DAY,
      repeatCount: 3,
      stoppedAt: null,
      today,
      currentBudgetStartDate: subDays(today, 1)
    };
    const result = getOccurenceInfo(args);
    expect(result).toEqual({
      nextOccurrenceDate: null,
      lastOccurrenceDate: today,
      nextOccurrenceCount: 3,
      occurrenceCount: 3,
      isFinished: true,
      isStopped: false,
      isDisabled: true
    });
  });

  it('should handle monthly recurring events that are ongoing', () => {
    const args: GetOccurrenceInfoArgs = {
      firstOccurrenceDate: getUtcMiddayDateOfGivenDate(new Date('2023-08-01')),
      recurrence: RecurrenceType.MULTIPLE,
      interval: Interval.MONTH,
      repeatCount: 6,
      stoppedAt: null,
      today,
      currentBudgetStartDate: subDays(today, 1)
    };

    const result = getOccurenceInfo(args);
    expect(result).toEqual({
      nextOccurrenceDate: getUtcMiddayDateOfGivenDate(new Date('2023-11-01')),
      lastOccurrenceDate: getUtcMiddayDateOfGivenDate(new Date('2023-10-01')),
      nextOccurrenceCount: 4,
      occurrenceCount: 3,
      isFinished: false,
      isStopped: false,
      isDisabled: false
    });
  });

  it('should handle quarterly recurring events that are ongoing', () => {
    const args: GetOccurrenceInfoArgs = {
      firstOccurrenceDate: getUtcMiddayDateOfGivenDate(new Date('2023-01-01')),
      recurrence: RecurrenceType.MULTIPLE,
      interval: Interval.QUARTER,
      repeatCount: 5,
      stoppedAt: null,
      today,
      currentBudgetStartDate: addDays(today, -1)
    };
    const result = getOccurenceInfo(args);
    expect(result).toEqual({
      nextOccurrenceDate: getUtcMiddayDateOfGivenDate(new Date('2024-01-01')),
      lastOccurrenceDate: getUtcMiddayDateOfGivenDate(new Date('2023-10-01')),
      nextOccurrenceCount: 5,
      occurrenceCount: 4,
      isFinished: false,
      isStopped: false,
      isDisabled: false
    });
  });

  it('should handle quarterly recurring events that have finished', () => {
    const args: GetOccurrenceInfoArgs = {
      firstOccurrenceDate: getUtcMiddayDateOfGivenDate(new Date('2022-01-01')),
      recurrence: RecurrenceType.MULTIPLE,
      interval: Interval.QUARTER,
      repeatCount: 6,
      stoppedAt: null,
      today,
      currentBudgetStartDate: addDays(today, -1)
    };

    const result = getOccurenceInfo(args);
    expect(result).toEqual({
      nextOccurrenceDate: null,
      lastOccurrenceDate: getUtcMiddayDateOfGivenDate(new Date('2023-04-01')),
      nextOccurrenceCount: 6,
      occurrenceCount: 6,
      isFinished: true,
      isStopped: false,
      isDisabled: true
    });
  });

  it('should handle monthly recurring events that have been stopped', () => {
    const args: GetOccurrenceInfoArgs = {
      firstOccurrenceDate: getUtcMiddayDateOfGivenDate(new Date('2023-06-01')),
      recurrence: RecurrenceType.MULTIPLE,
      interval: Interval.MONTH,
      repeatCount: 10,
      stoppedAt: getUtcMiddayDateOfGivenDate(new Date('2023-09-15')),
      today,
      currentBudgetStartDate: subDays(today, 1)
    };
    const result = getOccurenceInfo(args);
    expect(result).toEqual({
      nextOccurrenceDate: null,
      lastOccurrenceDate: getUtcMiddayDateOfGivenDate(new Date('2023-09-01')),
      nextOccurrenceCount: 4,
      occurrenceCount: 4,
      isFinished: false,
      isStopped: true,
      isDisabled: true
    });
  });

  it('should handle monthly recurring events that have not yet started', () => {
    const args: GetOccurrenceInfoArgs = {
      firstOccurrenceDate: addMonths(today, 1),
      recurrence: RecurrenceType.MULTIPLE,
      interval: Interval.MONTH,
      repeatCount: 5,
      stoppedAt: null,
      today,
      currentBudgetStartDate: subDays(today, 1)
    };
    const result = getOccurenceInfo(args);
    expect(result).toEqual({
      nextOccurrenceDate: addMonths(today, 1),
      lastOccurrenceDate: null,
      nextOccurrenceCount: 1,
      occurrenceCount: 0,
      isFinished: false,
      isStopped: false,
      isDisabled: false
    });
  });
});
