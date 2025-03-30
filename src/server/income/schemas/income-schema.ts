import { Interval, RecurrenceType } from '@prisma/client';
import { z } from 'zod';

import { dateSchemaWithMinDate } from '@/lib/dates/date-schema-with-min-date';

export const incomeSchema = z
  .object({
    name: z.string().min(1, 'Invalid income schema.'),
    valueCents: z.number().min(1, 'Invalid income schema.'),
    date: dateSchemaWithMinDate(),
    recurrence: z.nativeEnum(RecurrenceType),
    repeatCount: z.number().optional(),
    repeatEvery: z.nativeEnum(Interval).optional(),
    category: z.string().min(1, 'Invalid income schema.')
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
      message: 'Invalid income data.'
    }
  );
