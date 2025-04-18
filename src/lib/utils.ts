import { Interval } from '@prisma/client';
import { clsx, type ClassValue } from 'clsx';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getIntervalLabel = (
  interval: Interval | null | undefined,
  t: ReturnType<typeof useTranslations>
) => {
  if (!interval) return '';

  switch (interval) {
    case Interval.DAY:
      return t('day');
    case Interval.WEEK:
      return t('week');
    case Interval.TWO_WEEKS:
      return t('twoWeeks');
    case Interval.MONTH:
      return t('month');
    case Interval.TWO_MONTHS:
      return t('twoMonths');
    case Interval.QUARTER:
      return t('quarter');
    case Interval.YEAR:
      return t('year');
    default:
      return '';
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function assertUnreachable(_x: never): never {
  throw new Error("Didn't expect to get here");
}
