import { auth, clerkClient } from '@clerk/nextjs/server';
import { getLocale } from 'next-intl/server';

import { redirect } from '@/i18n/navigation';
import { pathGenerators } from '@/lib/paths';
import { prisma } from '@/lib/prisma/prisma-client';

export async function getAuthenticatedUser() {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    const locale = await getLocale();

    redirect({ href: pathGenerators.home(), locale });

    throw new Error('Unauthorized');
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId }
  });

  if (user) {
    return user;
  }

  const clerkClientInstance = await clerkClient();
  const clerkUser = await clerkClientInstance.users.getUser(clerkUserId);

  const createdUser = await prisma.user.upsert({
    where: {
      clerkId: clerkUserId
    },
    update: {
      email: clerkUser.emailAddresses[0].emailAddress,
      name:
        clerkUser.firstName && clerkUser.lastName
          ? `${clerkUser.firstName} ${clerkUser.lastName}`
          : clerkUser.emailAddresses[0].emailAddress,
      avatar: clerkUser.imageUrl
    },
    create: {
      email: clerkUser.emailAddresses[0].emailAddress,
      clerkId: clerkUserId,
      name:
        clerkUser.firstName && clerkUser.lastName
          ? `${clerkUser.firstName} ${clerkUser.lastName}`
          : clerkUser.emailAddresses[0].emailAddress,
      avatar: clerkUser.imageUrl
    }
  });

  return createdUser;
}
