import { z } from 'zod';

import { dateSchemaWithMinDate } from '@/lib/dates/date-schema-with-min-date/date-schema-with-min-date';

export const updatePouchSchema = z.object({
  name: z.string().min(1, 'Invalid pouch schema.'),
  category: z.string().min(1, 'Invalid pouch schema.')
});

export const updateOneTimePouchSchema = updatePouchSchema.extend({
  date: dateSchemaWithMinDate(),
  valueCents: z.number().min(1, 'Invalid pouch schema.')
});
