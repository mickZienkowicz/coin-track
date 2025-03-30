import { Interval } from '@prisma/client';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getIntervalLabel = (interval: Interval | null | undefined) => {
  if (!interval) return '';

  switch (interval) {
    case Interval.DAY:
      return 'dzień';
    case Interval.WEEK:
      return 'tydzień';
    case Interval.TWO_WEEKS:
      return 'dwa tygodnie';
    case Interval.MONTH:
      return 'miesiąc';
    case Interval.TWO_MONTHS:
      return 'dwa miesiące';
    case Interval.QUARTER:
      return 'kwartał';
    case Interval.YEAR:
      return 'rok';
    default:
      return '';
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function assertUnreachable(_x: never): never {
  throw new Error("Didn't expect to get here");
}
