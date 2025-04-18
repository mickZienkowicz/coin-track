import { Interval } from '@prisma/client';

export const getMonthlyMultiplier = (interval?: Interval) => {
  switch (interval) {
    case Interval.MONTH:
      return 1;
    case Interval.QUARTER:
      return 0.33;
    case Interval.YEAR:
      return 0.08;
    case Interval.WEEK:
      return 4;
    case Interval.DAY:
      return 30;
    case Interval.TWO_WEEKS:
      return 2;
    case Interval.TWO_MONTHS:
      return 0.5;
    default:
      return 1;
  }
};
