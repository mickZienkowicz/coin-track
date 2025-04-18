import { z } from 'zod';

import { dateSchemaWithMinDate } from '@/lib/dates/date-schema-with-min-date';

export const updateOutcomeSchema = z.object({
  name: z.string().min(1, 'Invalid outcome schema.'),
  category: z.string().min(1, 'Invalid outcome schema.')
});

export const updateOneTimeOutcomeSchema = updateOutcomeSchema.extend({
  date: dateSchemaWithMinDate(),
  valueCents: z.number().min(1, 'Invalid outcome schema.')
});
