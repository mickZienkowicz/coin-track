import { getDate, getMonth, getYear } from 'date-fns';

export const getUtcMiddayDateOfGivenDate = (date: Date): Date => {
  return new Date(
    Date.UTC(getYear(date), getMonth(date), getDate(date), 12, 0, 0, 0)
  );
};
