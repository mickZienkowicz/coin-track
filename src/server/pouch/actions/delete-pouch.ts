'use server';

import { getTranslations } from 'next-intl/server';

import { prisma } from '@/lib/prisma/prisma-client';
import { getAuthenticatedUser } from '@/server/utils/get-authenticated-user';

export async function deletePouch({ pouchId }: { pouchId: string }) {
  const t = await getTranslations('errors.pouch.delete');
  const user = await getAuthenticatedUser();

  const knownErrors = {
    failedToDeletePouch: t('failedToDeletePouch'),
    pouchNotFound: t('pouchNotFound'),
    pouchNotBelongsToUser: t('pouchNotBelongsToUser')
  };

  try {
    const pouch = await prisma.pouch.findUnique({
      where: {
        id: pouchId
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

    const deletedPouch = await prisma.pouch.delete({
      where: { id: pouchId }
    });

    return {
      success: true,
      message: t('success'),
      data: deletedPouch
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
      message: isKnownError ? error.message : knownErrors.failedToDeletePouch
    };
  }
}
