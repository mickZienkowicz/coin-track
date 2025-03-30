import { Interval } from '@prisma/client';
import { addDays, addMonths, addQuarters, addWeeks, addYears } from 'date-fns';

export const getDateOneIntervalAfter = ({
  date,
  interval
}: {
  date: Date;
  interval: Interval;
}) => {
  switch (interval) {
    case Interval.DAY:
      return addDays(date, 1);
    case Interval.WEEK:
      return addWeeks(date, 1);
    case Interval.TWO_WEEKS:
      return addWeeks(date, 2);
    case Interval.MONTH:
      return addMonths(date, 1);
    case Interval.TWO_MONTHS:
      return addMonths(date, 2);
    case Interval.QUARTER:
      return addQuarters(date, 1);
    case Interval.YEAR:
      return addYears(date, 1);
    default:
      return date;
  }
};
