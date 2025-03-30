import { z } from 'zod';

export const updatePouchSchema = z.object({
  name: z.string().min(1, 'Invalid pouch schema.'),
  category: z.string().min(1, 'Invalid pouch schema.')
});
