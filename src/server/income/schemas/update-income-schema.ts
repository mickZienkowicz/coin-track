import { z } from 'zod';

import { dateSchemaWithMinDate } from '@/lib/dates/date-schema-with-min-date';

export const updateIncomeSchema = z.object({
  name: z.string().min(1, 'Invalid income schema'),
  category: z.string().min(1, 'Invalid income schema')
});

export const updateOneTimeIncomeSchema = updateIncomeSchema.extend({
  date: dateSchemaWithMinDate(),
  valueCents: z.number().min(1, 'Invalid income schema.')
});
