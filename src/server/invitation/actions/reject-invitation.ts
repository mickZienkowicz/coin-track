'use server';

import { InvitationStatus } from '@prisma/client';
import { getTranslations } from 'next-intl/server';

import { prisma } from '@/lib/prisma/prisma-client';
import { getAuthenticatedUser } from '@/server/utils/get-authenticated-user';

export async function rejectInvitation({
  invitationId
}: {
  invitationId: string;
}) {
  const t = await getTranslations('errors.invitation.reject');
  const user = await getAuthenticatedUser();

  const knownErrors = {
    failedToRejectInvitation: t('failedToRejectInvitation'),
    invitationNotFound: t('invitationNotFound'),
    invitationNotForUser: t('invitationNotForUser'),
    invitationAlreadyAccepted: t('invitationAlreadyAccepted')
  };

  try {
    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId }
    });

    if (!invitation) {
      throw new Error(knownErrors.invitationNotFound);
    }

    if (invitation.toUserId !== user.id && invitation.fromUserId !== user.id) {
      throw new Error(knownErrors.invitationNotForUser);
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new Error(knownErrors.invitationAlreadyAccepted);
    }

    await prisma.invitation.update({
      where: { id: invitationId },
      data: { status: InvitationStatus.REJECTED }
    });

    return {
      success: true,
      message: 'Invitation rejected.'
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
        : knownErrors.failedToRejectInvitation
    };
  }
}
