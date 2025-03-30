'use server';

import { prisma } from '@/lib/prisma/prisma-client';
import { getAuthenticatedUser } from '@/server/utils/get-authenticated-user';

export async function getFamilies() {
  const user = await getAuthenticatedUser();

  const families = await prisma.family.findMany({
    where: {
      users: {
        some: { userId: user.id }
      }
    },
    include: {
      users: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          }
        }
      }
    }
  });

  return families.map((family) => ({
    ...family,
    users: family.users.map((user) => user.user)
  }));
}

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type FamilyWithUsers = ArrayElement<
  Awaited<ReturnType<typeof getFamilies>>
>;
