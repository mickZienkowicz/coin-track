'use server';

import { cookies } from 'next/headers';

import { prisma } from '@/lib/prisma/prisma-client';
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
    }
  });

  const selectedFamilyId = cookieStore.get('selectedFamilyId');
  const defaultFamily = families.at(0);
  const familyFromCookie = families.find(
    (family) => family.id === selectedFamilyId?.value
  );

  if (selectedFamilyId && familyFromCookie) {
    return familyFromCookie;
  }

  if (defaultFamily) {
    return defaultFamily;
  }

  return undefined;
}
