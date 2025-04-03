'use server';

import { auth } from '@clerk/nextjs/server';
import { getLocale, getTranslations } from 'next-intl/server';
import { z } from 'zod';

import { redirect } from '@/i18n/navigation';
import { dateSchemaWithMinDate } from '@/lib/dates/date-schema-with-min-date';
import { getUtcMiddayDateOfGivenDate } from '@/lib/dates/get-utc-midday-date-of-given-date';
import { pathGenerators } from '@/lib/paths';
import { prisma } from '@/lib/prisma/prisma-client';
import { getBudget } from '@/server/budget/queries/get-budget';

import { pouchOutcomeSchema } from '../schemas/pouch-outcome-schema';

export const createPouchOutcome = async ({
  data
}: {
  data: z.infer<typeof pouchOutcomeSchema>;
}) => {
  const t = await getTranslations('errors.pouchOutcome.create');
  const { userId: clerkUserId } = await auth();

  const knownErrors = {
    invalidPouchOutcomeData: t('invalidPouchOutcomeData'),
    budgetNotFound: t('budgetNotFound'),
    pouchNotFound: t('pouchNotFound'),
    failedToCreatePouchOutcome: t('failedToCreatePouchOutcome'),
    unauthorized: t('unauthorized')
  };

  if (!clerkUserId) {
    const locale = await getLocale();

    redirect({ href: pathGenerators.home(), locale });

    throw new Error(knownErrors.unauthorized);
  }

  const budget = await getBudget();

  try {
    const pouch = await prisma.pouch.findUnique({
      where: {
        id: data.pouchId
      }
    });

    if (!pouch) {
      throw new Error(knownErrors.pouchNotFound);
    }

    if (!budget) {
      throw new Error(knownErrors.budgetNotFound);
    }

    if (!pouchOutcomeSchema.safeParse(data).success) {
      throw new Error(knownErrors.invalidPouchOutcomeData);
    }

    if (!dateSchemaWithMinDate().safeParse(data.date).success) {
      throw new Error(knownErrors.invalidPouchOutcomeData);
    }

    const pouchOutcome = await prisma.pouchExpense.create({
      data: {
        pouchId: data.pouchId,
        name: data.name,
        valueCents: data.valueCents,
        date: getUtcMiddayDateOfGivenDate(data.date)
      }
    });

    return {
      success: true,
      message: t('success'),
      data: pouchOutcome
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
      message:
        error instanceof Error
          ? error.message
          : knownErrors.failedToCreatePouchOutcome
    };
  }
};
