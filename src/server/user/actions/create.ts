'use server';

import { prisma } from '@/lib/prisma/prisma-client';

export async function createUser_DANGEROUS_ONLY_FOR_INTERNAL_USE({
  clerkId,
  email,
  name,
  avatar
}: {
  clerkId: string;
  email: string;
  name: string;
  avatar?: string;
}) {
  try {
    const createdUser = await prisma.user.upsert({
      where: {
        clerkId
      },
      update: {
        email,
        name,
        avatar
      },
      create: {
        email,
        clerkId,
        name,
        avatar
      }
    });

    return {
      success: true,
      message: 'User created.',
      data: createdUser
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create user.'
    };
  }
}
