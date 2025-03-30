import { getDate, getMonth, getYear } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export const getUtcMiddayDateOfGivenTimezone = (
  timezone: string,
  date?: Date
) => {
  const now = date || new Date();
  const zonedDate = toZonedTime(now, timezone);

  const year = getYear(zonedDate);
  const month = getMonth(zonedDate);
  const dayOfMonth = getDate(zonedDate);

  return new Date(Date.UTC(year, month, dayOfMonth, 12, 0, 0, 0));
};
