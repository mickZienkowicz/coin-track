import { z } from 'zod';

export const updateOutcomeSchema = z.object({
  name: z.string().min(1, 'Invalid outcome schema.'),
  category: z.string().min(1, 'Invalid outcome schema.')
});
