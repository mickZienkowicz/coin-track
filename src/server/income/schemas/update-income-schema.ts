import { z } from 'zod';

export const updateIncomeSchema = z.object({
  name: z.string().min(1, 'Invalid income schema'),
  category: z.string().min(1, 'Invalid income schema')
});
