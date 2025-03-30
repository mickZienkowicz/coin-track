import { z } from 'zod';

import { dateSchemaWithMinDate } from '@/lib/dates/date-schema-with-min-date';

export const updatePouchOutcomeSchema = z.object({
  valueCents: z.number(),
  name: z.string(),
  date: dateSchemaWithMinDate({ message: 'Date is required.' })
});
