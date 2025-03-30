'use server';

import { auth } from '@clerk/nextjs/server';
import { RecurrenceType } from '@prisma/client';
import { getLocale, getTranslations } from 'next-intl/server';
import { z } from 'zod';

import { redirect } from '@/i18n/navigation';
import { dateSchemaWithMinDate } from '@/lib/dates/date-schema-with-min-date';
import { getUtcMiddayDateOfGivenDate } from '@/lib/dates/get-utc-midday-date-of-given-date';
import { pathGenerators } from '@/lib/paths';
import { prisma } from '@/lib/prisma/prisma-client';
import { getBudget } from '@/server/budget/queries/get-budget';

import { pouchSchema } from '../schemas/pouch-schema';

export const createPouch = async ({
  data
}: {
  data: z.infer<typeof pouchSchema>;
}) => {
  const t = await getTranslations('errors.pouch.create');
  const { userId: clerkUserId } = await auth();

  const knownErrors = {
    invalidPouchData: t('invalidPouchData'),
    budgetNotFound: t('budgetNotFound'),
    repeatCountRequired: t('repeatCountRequired'),
    repeatEveryRequired: t('repeatEveryRequired'),
    failedToCreatePouch: t('failedToCreatePouch'),
    unauthorized: t('unauthorized')
  };

  if (!clerkUserId) {
    const locale = await getLocale();

    redirect({ href: pathGenerators.home(), locale });

    throw new Error(knownErrors.unauthorized);
  }

  const budget = await getBudget();

  try {
    if (!budget) {
      throw new Error(knownErrors.budgetNotFound);
    }

    if (!pouchSchema.safeParse(data).success) {
      throw new Error(knownErrors.invalidPouchData);
    }

    if (!dateSchemaWithMinDate().safeParse(data.date).success) {
      throw new Error(knownErrors.invalidPouchData);
    }

    if (data.recurrence === RecurrenceType.MULTIPLE && !data.repeatCount) {
      throw new Error(knownErrors.repeatCountRequired);
    }

    if (data.recurrence !== RecurrenceType.ONE_TIME && !data.repeatEvery) {
      throw new Error(knownErrors.repeatEveryRequired);
    }

    const pouch = await prisma.pouch.create({
      data: {
        name: data.name,
        valueCents: data.valueCents,
        date: getUtcMiddayDateOfGivenDate(data.date),
        recurrence: data.recurrence,
        repeatCount: data.repeatCount,
        repeatEvery: data.repeatEvery,
        category: data.category,
        budget: {
          connect: {
            id: budget.id
          }
        }
      }
    });

    return {
      success: true,
      message: 'Pouch created successfully.',
      data: pouch
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
        error instanceof Error ? error.message : knownErrors.failedToCreatePouch
    };
  }
};
