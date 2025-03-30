'use server';

import { prisma } from '@/lib/prisma/prisma-client';
import { getAuthenticatedUser } from '@/server/utils/get-authenticated-user';

export async function getSentInvitations() {
  const user = await getAuthenticatedUser();

  const invitations = await prisma.invitation.findMany({
    where: { fromUserId: user.id },
    include: {
      family: true,
      toUser: true,
      fromUser: true
    }
  });

  return invitations;
}
