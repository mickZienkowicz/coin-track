'use server';

import { RecurrenceType } from '@prisma/client';
import { getTranslations } from 'next-intl/server';

import { prisma } from '@/lib/prisma/prisma-client';
import { getAuthenticatedUser } from '@/server/utils/get-authenticated-user';

import {
  updateOneTimePouchSchema,
  updatePouchSchema
} from '../schemas/update-pouch-schema';

export async function updatePouch({
  id,
  data
}: {
  id: string;
  data: {
    name: string;
    category: string;
    date?: Date;
    valueCents?: number;
  };
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

    if (pouch.recurrence === RecurrenceType.ONE_TIME) {
      if (!updateOneTimePouchSchema.safeParse(data).success) {
        throw new Error(knownErrors.invalidPouchData);
      }

      const updatedPouch = await prisma.pouch.update({
        where: {
          id
        },
        data: {
          name: data.name,
          category: data.category,
          date: data.date || pouch.date,
          valueCents: data.valueCents || pouch.valueCents
        }
      });

      return {
        success: true,
        message: t('success'),
        data: updatedPouch
      };
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
      message: t('success'),
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
