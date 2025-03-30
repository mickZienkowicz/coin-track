import { Interval } from '@prisma/client';
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  differenceInDays,
  differenceInMonths,
  differenceInWeeks,
  differenceInYears,
  subDays
} from 'date-fns';

export const getCurrentBudgetPeriod = (
  budgetStartDate: Date,
  budgetInterval: Interval,
  today: Date
): { startDate: Date; endDate: Date } => {
  let completedIntervals: number;
  let currentPeriodStart: Date;
  let currentPeriodEnd: Date;

  switch (budgetInterval) {
    case Interval.DAY:
      completedIntervals = differenceInDays(today, budgetStartDate);
      currentPeriodStart = addDays(budgetStartDate, completedIntervals);
      currentPeriodEnd = addDays(currentPeriodStart, 1);
      break;

    case Interval.WEEK:
      completedIntervals = differenceInWeeks(today, budgetStartDate);
      currentPeriodStart = addWeeks(budgetStartDate, completedIntervals);
      currentPeriodEnd = addWeeks(currentPeriodStart, 1);
      break;

    case Interval.TWO_WEEKS:
      completedIntervals = Math.floor(
        differenceInWeeks(today, budgetStartDate) / 2
      );
      currentPeriodStart = addWeeks(budgetStartDate, completedIntervals * 2);
      currentPeriodEnd = addWeeks(currentPeriodStart, 2);
      break;

    case Interval.MONTH:
      completedIntervals = differenceInMonths(today, budgetStartDate);
      currentPeriodStart = addMonths(budgetStartDate, completedIntervals);
      currentPeriodEnd = addMonths(currentPeriodStart, 1);
      break;

    case Interval.TWO_MONTHS:
      completedIntervals = Math.floor(
        differenceInMonths(today, budgetStartDate) / 2
      );
      currentPeriodStart = addMonths(budgetStartDate, completedIntervals * 2);
      currentPeriodEnd = addMonths(currentPeriodStart, 2);
      break;

    case Interval.QUARTER:
      completedIntervals = Math.floor(
        differenceInMonths(today, budgetStartDate) / 3
      );
      currentPeriodStart = addMonths(budgetStartDate, completedIntervals * 3);
      currentPeriodEnd = addMonths(currentPeriodStart, 3);
      break;

    case Interval.YEAR:
      completedIntervals = differenceInYears(today, budgetStartDate);
      currentPeriodStart = addYears(budgetStartDate, completedIntervals);
      currentPeriodEnd = addYears(currentPeriodStart, 1);
      break;

    default:
      throw new Error('Invalid interval');
  }

  return {
    startDate: currentPeriodStart,
    endDate: subDays(currentPeriodEnd, 1)
  };
};
