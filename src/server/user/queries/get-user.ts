'use server';

import { getAuthenticatedUser } from '@/server/utils/get-authenticated-user';

export async function getUser() {
  const user = await getAuthenticatedUser();

  return user;
}
