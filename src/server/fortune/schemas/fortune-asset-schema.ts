import { AssetCategory } from '@prisma/client';
import { z } from 'zod';

export const fortuneAssetSchema = z.object({
  name: z.string(),
  description: z.string(),
  category: z.nativeEnum(AssetCategory),
  valueCents: z.number()
});
