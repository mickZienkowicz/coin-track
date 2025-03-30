'use server';

import { InvitationStatus } from '@prisma/client';
import { getTranslations } from 'next-intl/server';

import { prisma } from '@/lib/prisma/prisma-client';
import { getAuthenticatedUser } from '@/server/utils/get-authenticated-user';

export async function sendInvitation({
  familyId,
  email
}: {
  familyId: string;
  email: string;
}) {
  const t = await getTranslations('errors.invitation.send');
  const user = await getAuthenticatedUser();

  const knownErrors = {
    failedToSendInvitation: t('failedToSendInvitation'),
    userNotFound: t('userNotFound'),
    familyNotFound: t('familyNotFound'),
    cannotInviteSelf: t('cannotInviteSelf'),
    userAlreadyMemberOfFamily: t('userAlreadyMemberOfFamily'),
    invitationAlreadyExists: t('invitationAlreadyExists'),
    notFamilyOwner: t('notFamilyOwner')
  };

  try {
    const userToInvite = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (!userToInvite) {
      throw new Error(knownErrors.userNotFound);
    }

    const family = await prisma.family.findUnique({
      where: {
        id: familyId
      },
      include: {
        users: true
      }
    });

    if (!family) {
      throw new Error(knownErrors.familyNotFound);
    }

    if (user.id === userToInvite.id) {
      throw new Error(knownErrors.cannotInviteSelf);
    }

    if (user.id !== family.ownerId) {
      throw new Error(knownErrors.notFamilyOwner);
    }

    const isUserAlreadyMemberOfFamily = family.users.some(
      (familyUser) => familyUser.userId === userToInvite.id
    );

    if (isUserAlreadyMemberOfFamily) {
      throw new Error(knownErrors.userAlreadyMemberOfFamily);
    }

    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        toUserId: userToInvite.id,
        familyId,
        status: InvitationStatus.PENDING
      }
    });

    if (existingInvitation) {
      throw new Error(knownErrors.invitationAlreadyExists);
    }

    const invitation = await prisma.invitation.create({
      data: {
        fromUserId: user.id,
        toUserId: userToInvite.id,
        familyId
      }
    });

    return {
      success: true,
      message: 'Invitation sent.',
      data: invitation
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
      message: isKnownError ? error.message : knownErrors.failedToSendInvitation
    };
  }
}
