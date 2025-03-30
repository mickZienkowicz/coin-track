import { z } from 'zod';

import { getUtcMiddayDateOfGivenDate } from '../get-utc-midday-date-of-given-date';

export const dateSchemaWithMinDate = (arg?: { message?: string }) =>
  z
    .date({ message: arg?.message || 'Date is required.' })
    .refine(
      (date) => date >= getUtcMiddayDateOfGivenDate(new Date('2010-01-01')),
      {
        message: 'Date must be on or after January 1, 2010.'
      }
    );
