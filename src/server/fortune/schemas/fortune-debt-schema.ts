import { z } from 'zod';

export const fortuneDebtSchema = z.object({
  name: z.string(),
  description: z.string(),
  valueCents: z.number()
});
