'use server';

import { InvitationStatus } from '@prisma/client';

import { prisma } from '@/lib/prisma/prisma-client';
import { getAuthenticatedUser } from '@/server/utils/get-authenticated-user';

export async function getReceivedInvitations() {
  const user = await getAuthenticatedUser();

  const invitations = await prisma.invitation.findMany({
    where: { toUserId: user.id, status: InvitationStatus.PENDING },
    include: {
      family: true,
      toUser: true,
      fromUser: true
    }
  });

  return invitations;
}
