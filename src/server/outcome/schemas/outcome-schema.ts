import { Interval, RecurrenceType } from '@prisma/client';
import { z } from 'zod';

import { dateSchemaWithMinDate } from '@/lib/dates/date-schema-with-min-date/date-schema-with-min-date';

export const outcomeSchema = z
  .object({
    name: z.string().min(1, 'Invalid outcome schema.'),
    valueCents: z.number().min(1, 'Invalid outcome schema.'),
    date: dateSchemaWithMinDate({ message: 'Date is required.' }),
    recurrence: z.nativeEnum(RecurrenceType),
    repeatCount: z.number().optional(),
    repeatEvery: z.nativeEnum(Interval).optional(),
    category: z.string().min(1, 'Invalid outcome schema.')
  })
  .refine(
    (data) => {
      if (data.recurrence !== RecurrenceType.ONE_TIME && !data.repeatEvery) {
        return false;
      }
      if (data.recurrence === RecurrenceType.MULTIPLE && !data.repeatCount) {
        return false;
      }
      return true;
    },
    {
      message: 'Invalid outcome data.'
    }
  );
