import { Interval } from '@prisma/client';
import { z } from 'zod';

export const createGoalSchema = z.object({
  name: z.string().min(1),
  valueCents: z.number().min(1),
  initialDepositCents: z.number().min(0),
  endDate: z.date(),
  savingInterval: z.nativeEnum(Interval)
});
