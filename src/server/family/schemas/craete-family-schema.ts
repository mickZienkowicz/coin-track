import { Interval } from '@prisma/client';
import { z } from 'zod';

import { dateSchemaWithMinDate } from '@/lib/dates/date-schema-with-min-date';

export const createFamilySchema = z.object({
  name: z.string().min(1),
  currency: z.string().min(1),
  timezone: z.string().min(1),
  budgetStartDate: dateSchemaWithMinDate(),
  budgetInterval: z.nativeEnum(Interval),
  budgetTransferPouchBalance: z.boolean()
});
