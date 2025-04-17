import { z } from 'zod';

export const getNumberSchema = (errorMessage: string) =>
  z
    .string({ required_error: errorMessage })
    .min(1, errorMessage)
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val), errorMessage)
    .refine((val) => val >= 0, errorMessage);
