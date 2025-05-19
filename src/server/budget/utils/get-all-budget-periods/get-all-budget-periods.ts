import { Interval } from '@prisma/client';
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  isBefore,
  isSameDay
} from 'date-fns';

import { getCurrentBudgetPeriod } from '@/lib/dates/get-current-budget-period';

interface BudgetPeriod {
  startDate: Date;
  endDate: Date;
}

export const getAllBudgetPeriods = (
  budgetStartDate: Date,
  budgetInterval: Interval,
  today: Date
): BudgetPeriod[] => {
  const periods: BudgetPeriod[] = [];
  let currentDate = budgetStartDate;

  while (isBefore(currentDate, today) || isSameDay(currentDate, today)) {
    const period = getCurrentBudgetPeriod(
      budgetStartDate,
      budgetInterval,
      currentDate
    );
    periods.push(period);

    switch (budgetInterval) {
      case Interval.DAY:
        currentDate = addDays(currentDate, 1);
        break;
      case Interval.WEEK:
        currentDate = addWeeks(currentDate, 1);
        break;
      case Interval.TWO_WEEKS:
        currentDate = addWeeks(currentDate, 2);
        break;
      case Interval.MONTH:
        currentDate = addMonths(currentDate, 1);
        break;
      case Interval.TWO_MONTHS:
        currentDate = addMonths(currentDate, 2);
        break;
      case Interval.QUARTER:
        currentDate = addMonths(currentDate, 3);
        break;
      case Interval.YEAR:
        currentDate = addYears(currentDate, 1);
        break;
      default:
        throw new Error('Invalid interval');
    }
  }

  return periods;
};
