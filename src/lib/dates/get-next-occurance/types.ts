import {
  Income,
  Interval,
  Outcome,
  Pouch,
  RecurrenceType
} from '@prisma/client';

export type GetOccurrenceInfoArgs = {
  firstOccurrenceDate: Date;
  recurrence: RecurrenceType;
  interval: Interval | null;
  repeatCount: number | null;
  stoppedAt: Date | null;
  today: Date;
  currentBudgetStartDate: Date;
};

export type GetOccurrenceInfoResult = {
  nextOccurrenceDate: Date | null;
  nextOccurrenceCount: number;
  lastOccurrenceDate: Date | null;
  occurrenceCount: number;
  isFinished: boolean;
  isStopped: boolean;
  isDisabled: boolean;
};

export type IncomeWithOccurenceInfo = Income & GetOccurrenceInfoResult;

export type OutcomeWithOccurenceInfo = Outcome & GetOccurrenceInfoResult;

export type PouchWithOccurenceInfo = Pouch & GetOccurrenceInfoResult;
