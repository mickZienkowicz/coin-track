'use server';

import { getTranslations } from 'next-intl/server';

import { prisma } from '@/lib/prisma/prisma-client';
import { getAuthenticatedUser } from '@/server/utils/get-authenticated-user';

export async function removeUserFromFamily({
  familyId,
  userToRemoveId
}: {
  familyId: string;
  userToRemoveId: string;
}) {
  const t = await getTranslations('errors.family.removeUser');
  const user = await getAuthenticatedUser();

  const knownErrors = {
    failedToRemoveUserFromFamily: t('failedToRemoveUserFromFamily'),
    familyNotFound: t('familyNotFound'),
    notFamilyOwner: t('notFamilyOwner'),
    cannotRemoveSelf: t('cannotRemoveSelf'),
    cannotRemoveOwner: t('cannotRemoveOwner'),
    userNotFoundInFamily: t('userNotFoundInFamily')
  };

  try {
    const family = await prisma.family.findUnique({
      where: { id: familyId }
    });

    if (!family) {
      throw new Error(knownErrors.familyNotFound);
    }

    if (family.ownerId !== user.id) {
      throw new Error(knownErrors.notFamilyOwner);
    }

    if (userToRemoveId === user.id) {
      throw new Error(knownErrors.cannotRemoveSelf);
    }

    if (family.ownerId === userToRemoveId) {
      throw new Error(knownErrors.cannotRemoveOwner);
    }

    const familyUser = await prisma.userFamily.findUnique({
      where: { userId_familyId: { userId: userToRemoveId, familyId } }
    });

    if (!familyUser) {
      throw new Error(knownErrors.userNotFoundInFamily);
    }

    await prisma.userFamily.delete({
      where: { userId_familyId: { userId: userToRemoveId, familyId } }
    });

    return {
      success: true,
      message: 'User removed from family.'
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
      message: isKnownError
        ? error.message
        : knownErrors.failedToRemoveUserFromFamily
    };
  }
}
