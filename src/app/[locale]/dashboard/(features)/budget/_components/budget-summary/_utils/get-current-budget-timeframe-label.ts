import { format, isSameMonth, isSameYear } from 'date-fns';

import { Language } from '@/i18n/routing';
import { getDateFnsLocaleFromLanguage } from '@/lib/locale/get-date-fns-locale-from-language';

export const getCurrentBudgetTimeframeLabel = ({
  startDate,
  finishDate,
  locale
}: {
  startDate: Date;
  finishDate: Date;
  locale: Language;
}) => {
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
    locale: getDateFnsLocaleFromLanguage(locale as Language)
  })}${isSameMonthBudget ? '-' : ' - '}${format(finishDate, 'd MMMM yyyy', {
    locale: getDateFnsLocaleFromLanguage(locale as Language)
  })}`;
};
