'use server';

import { getTranslations } from 'next-intl/server';
import { z } from 'zod';

import { prisma } from '@/lib/prisma/prisma-client';
import { getAuthenticatedUser } from '@/server/utils/get-authenticated-user';

import { updatePouchSchema } from '../schemas/update-pouch-schema';

export async function updatePouch({
  id,
  data
}: {
  id: string;
  data: z.infer<typeof updatePouchSchema>;
}) {
  const t = await getTranslations('errors.pouch.update');
  const user = await getAuthenticatedUser();

  const knownErrors = {
    failedToUpdatePouch: t('failedToUpdatePouch'),
    pouchNotFound: t('pouchNotFound'),
    pouchNotBelongsToUser: t('pouchNotBelongsToUser'),
    invalidPouchData: t('invalidPouchData')
  };

  try {
    const pouch = await prisma.pouch.findUnique({
      where: {
        id
      },
      include: {
        budget: {
          include: {
            family: {
              include: {
                users: true
              }
            }
          }
        }
      }
    });

    if (!pouch) {
      throw new Error(knownErrors.pouchNotFound);
    }

    const isPouchBelongsToUser = pouch.budget.family.users.some(
      (familyUser) => familyUser.userId === user.id
    );

    if (!isPouchBelongsToUser) {
      throw new Error(knownErrors.pouchNotBelongsToUser);
    }

    if (!updatePouchSchema.safeParse(data).success) {
      throw new Error(knownErrors.invalidPouchData);
    }

    const updatedPouch = await prisma.pouch.update({
      where: {
        id
      },
      data: {
        name: data.name,
        category: data.category
      }
    });

    return {
      success: true,
      message: 'Pouch updated successfully.',
      data: updatedPouch
    };
  } catch (error) {
    const isKnownError =
      error instanceof Error &&
      Object.values(knownErrors).includes(error.message);

    if (!isKnownError) {
      console.error(error);
    }

    return {
      success: false,
      message: isKnownError ? error.message : knownErrors.failedToUpdatePouch
    };
  }
}
