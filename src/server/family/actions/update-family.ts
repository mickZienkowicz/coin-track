'use server';

import { getTranslations } from 'next-intl/server';

import { currencyCodes } from '@/lib/currencies/currencies-list';
import { timezoneCodes } from '@/lib/dates/time-zones/time-zones';
import { prisma } from '@/lib/prisma/prisma-client';
import { getAuthenticatedUser } from '@/server/utils/get-authenticated-user';

export async function updateFamily({
  familyId,
  name,
  currency,
  timezone
}: {
  familyId: string;
  name: string;
  currency: string;
  timezone: string;
}) {
  const t = await getTranslations('errors.family.update');
  const user = await getAuthenticatedUser();

  const knownErrors = {
    failedToUpdateFamily: t('failedToUpdateFamily'),
    familyNotFound: t('familyNotFound'),
    notFamilyOwner: t('notFamilyOwner'),
    invalidName: t('invalidName'),
    invalidCurrency: t('invalidCurrency'),
    invalidTimezone: t('invalidTimezone')
  };

  try {
    const family = await prisma.family.findUnique({
      where: { id: familyId }
    });

    if (!family) {
      throw new Error(knownErrors.familyNotFound);
    }

    if (family.ownerId !== user.id) {
      throw new Error(knownErrors.notFamilyOwner);
    }

    if (!name) {
      throw new Error(knownErrors.invalidName);
    }

    if (!currencyCodes.includes(currency)) {
      throw new Error(knownErrors.invalidCurrency);
    }

    if (!timezoneCodes.includes(timezone)) {
      throw new Error(knownErrors.invalidTimezone);
    }

    const updatedFamily = await prisma.family.update({
      where: { id: familyId },
      data: { name, currency, timezone }
    });

    return {
      success: true,
      message: 'Family updated.',
      data: updatedFamily
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
      message: isKnownError ? error.message : knownErrors.failedToUpdateFamily
    };
  }
}
