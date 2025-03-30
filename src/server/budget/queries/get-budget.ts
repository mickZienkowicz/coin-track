'use server';

import { auth } from '@clerk/nextjs/server';
import { getLocale } from 'next-intl/server';

import { redirect } from '@/i18n/navigation';
import { pathGenerators } from '@/lib/paths';
import { prisma } from '@/lib/prisma/prisma-client';
import { getSelectedFamilyId } from '@/server/family/queries/get-selected-family-id';

export async function getBudget() {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    const locale = await getLocale();

    redirect({ href: pathGenerators.home(), locale });

    throw new Error('Unauthorized');
  }

  const familyId = await getSelectedFamilyId();

  if (!familyId) {
    return null;
  }

  const family = await prisma.family.findUnique({
    where: { id: familyId }
  });

  if (!family) {
    return null;
  }

  const budget = await prisma.budget.findUnique({
    where: {
      familyId: familyId
    },
    include: {
      family: true
    }
  });

  if (budget) {
    return budget;
  }

  const createdBudget = await prisma.budget.create({
    data: {
      familyId: familyId
    },
    include: {
      family: true
    }
  });

  return createdBudget;
}
