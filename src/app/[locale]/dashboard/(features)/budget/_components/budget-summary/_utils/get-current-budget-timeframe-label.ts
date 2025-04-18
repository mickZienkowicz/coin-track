import { Interval } from '@prisma/client';
import {
  format,
  getDate,
  getMonth,
  getQuarter,
  isFirstDayOfMonth,
  isSameMonth,
  isSameYear
} from 'date-fns';

import { Language } from '@/i18n/routing';
import { getDateFnsLocaleFromLanguage } from '@/lib/locale/get-date-fns-locale-from-language';

export const getCurrentBudgetTimeframeLabel = ({
  startDate,
  finishDate,
  locale,
  budgetInterval
}: {
  startDate: Date;
  finishDate: Date;
  locale: Language;
  budgetInterval: Interval;
}) => {
  const dateFnsLocale = getDateFnsLocaleFromLanguage(locale as Language);

  const isFirstDay = isFirstDayOfMonth(startDate);
  const isFirstMonth = getMonth(startDate) === 0;
  const isFirstDayOfYear = isFirstDay && isFirstMonth;

  if (budgetInterval === Interval.MONTH && isFirstDay) {
    const monthYear = format(startDate, 'LLLL yyyy', { locale: dateFnsLocale });
    return monthYear.charAt(0).toUpperCase() + monthYear.slice(1);
  }

  if (
    budgetInterval === Interval.QUARTER &&
    isFirstDay &&
    getDate(startDate) === 1
  ) {
    const quarter = getQuarter(startDate);
    return `${['I', 'II', 'III', 'IV'][quarter - 1]} ${format(startDate, 'yyyy', { locale: dateFnsLocale })}`;
  }

  if (budgetInterval === Interval.YEAR && isFirstDayOfYear) {
    return format(startDate, 'yyyy', { locale: dateFnsLocale });
  }

  const isSameYearBudget = isSameYear(startDate, finishDate);
  const isSameMonthBudget = isSameMonth(startDate, finishDate);

  let startDateFormatting = 'd MMMM yyyy';
  if (isSameYearBudget) {
    startDateFormatting = 'd MMMM';
  }
  if (isSameMonthBudget) {
    startDateFormatting = 'd';
  }

  return `${format(startDate, startDateFormatting, {
    locale: dateFnsLocale
  })}${isSameMonthBudget ? '-' : ' - '}${format(finishDate, 'd MMMM yyyy', {
    locale: dateFnsLocale
  })}`;
};
