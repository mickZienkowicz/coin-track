'use server';

import { InvitationStatus } from '@prisma/client';
import { getTranslations } from 'next-intl/server';

import { prisma } from '@/lib/prisma/prisma-client';
import { getAuthenticatedUser } from '@/server/utils/get-authenticated-user';

export async function acceptInvitation({
  invitationId
}: {
  invitationId: string;
}) {
  const t = await getTranslations('errors.invitation.accept');
  const user = await getAuthenticatedUser();

  const knownErrors = {
    failedToAcceptInvitation: t('failedToAcceptInvitation'),
    invitationNotFound: t('invitationNotFound'),
    invitationNotForUser: t('invitationNotForUser'),
    invitationAlreadyAccepted: t('invitationAlreadyAccepted'),
    invitationAlreadyRejected: t('invitationAlreadyRejected'),
    familyNotFound: t('familyNotFound')
  };

  try {
    const invitation = await prisma.invitation.findUnique({
      where: {
        id: invitationId
      }
    });

    if (!invitation) {
      throw new Error(knownErrors.invitationNotFound);
    }

    if (invitation.toUserId !== user.id) {
      throw new Error(knownErrors.invitationNotForUser);
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new Error(
        invitation.status === InvitationStatus.ACCEPTED
          ? knownErrors.invitationAlreadyAccepted
          : knownErrors.invitationAlreadyRejected
      );
    }

    const family = await prisma.family.findUnique({
      where: {
        id: invitation.familyId
      }
    });

    if (!family) {
      throw new Error(knownErrors.familyNotFound);
    }

    await prisma.family.update({
      where: {
        id: family.id
      },
      data: {
        users: {
          create: {
            userId: user.id
          }
        }
      }
    });

    await prisma.invitation.update({
      where: { id: invitationId },
      data: { status: InvitationStatus.ACCEPTED }
    });

    return {
      success: true,
      message: 'Invitation accepted.'
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
        : knownErrors.failedToAcceptInvitation
    };
  }
}
