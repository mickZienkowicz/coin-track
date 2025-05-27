'use server';

import { cookies } from 'next/headers';

import { prisma } from '@/lib/prisma/prisma-client';
import { syncSubscription } from '@/server/subscription/actions/sync-subscription';
import { getAuthenticatedUser } from '@/server/utils/get-authenticated-user';

export async function getSelectedFamily() {
  const cookieStore = await cookies();
  const user = await getAuthenticatedUser();

  const families = await prisma.family.findMany({
    where: {
      users: {
        some: {
          userId: user.id
        }
      }
    },
    include: {
      owner: true,
      subscription: true
    }
  });

  const selectedFamilyId = cookieStore.get('selectedFamilyId');
  const defaultFamily = families.at(0);
  const familyFromCookie = families.find(
    (family) => family.id === selectedFamilyId?.value
  );

  if (selectedFamilyId && familyFromCookie) {
    if (familyFromCookie.subscription?.stripeSubscriptionId) {
      await syncSubscription(
        familyFromCookie.subscription.stripeSubscriptionId
      );
    }

    return familyFromCookie;
  }

  if (defaultFamily) {
    if (defaultFamily.subscription?.stripeSubscriptionId) {
      await syncSubscription(defaultFamily.subscription.stripeSubscriptionId);
    }

    return defaultFamily;
  }

  return undefined;
}
