import { Interval } from '@prisma/client';
import { subDays, subMonths, subQuarters, subWeeks, subYears } from 'date-fns';

export const getDateOneIntervalBefore = ({
  date,
  interval
}: {
  date: Date;
  interval: Interval;
}) => {
  switch (interval) {
    case Interval.DAY:
      return subDays(date, 1);
    case Interval.WEEK:
      return subWeeks(date, 1);
    case Interval.TWO_WEEKS:
      return subWeeks(date, 2);
    case Interval.MONTH:
      return subMonths(date, 1);
    case Interval.TWO_MONTHS:
      return subMonths(date, 2);
    case Interval.QUARTER:
      return subQuarters(date, 1);
    case Interval.YEAR:
      return subYears(date, 1);
    default:
      return date;
  }
};
