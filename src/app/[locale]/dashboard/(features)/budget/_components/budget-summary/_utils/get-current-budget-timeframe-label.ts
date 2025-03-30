import { format, isSameYear } from 'date-fns';
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

  const startDateFormatting = `d MMMM${isSameYearBudget ? '' : ' yyyy'}`;

  return `${format(startDate, startDateFormatting, {
    locale: getDateFnsLocaleFromLanguage(locale as Language)
  })} - ${format(finishDate, 'd MMMM yyyy', {
    locale: getDateFnsLocaleFromLanguage(locale as Language)
  })}`;
};
