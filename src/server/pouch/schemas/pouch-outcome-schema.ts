import { z } from 'zod';

import { dateSchemaWithMinDate } from '@/lib/dates/date-schema-with-min-date';

export const pouchOutcomeSchema = z.object({
  pouchId: z.string(),
  valueCents: z.number(),
  name: z.string(),
  date: dateSchemaWithMinDate({ message: 'Date is required.' })
});
