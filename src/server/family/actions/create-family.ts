'use server';

import { Interval } from '@prisma/client';
import { getTranslations } from 'next-intl/server';

import { currencyCodes } from '@/lib/currencies/currencies-list';
import { timezoneCodes } from '@/lib/dates/time-zones/time-zones';
import { prisma } from '@/lib/prisma/prisma-client';
import { stripe } from '@/lib/stripe';
import { createBudget } from '@/server/budget/actions/create-budget';
import { getAuthenticatedUser } from '@/server/utils/get-authenticated-user';

export async function createFamily(data: {
  name: string;
  currency: string;
  timezone: string;
  budgetStartDate: Date;
  budgetInterval: Interval;
  budgetTransferPouchBalance: boolean;
}) {
  const t = await getTranslations('errors.family.create');
  const user = await getAuthenticatedUser();

  const knownErrors = {
    failedToCreateFamily: t('failedToCreateFamily'),
    invalidCurrency: t('invalidCurrency'),
    invalidName: t('invalidName'),
    invalidTimezone: t('invalidTimezone')
  };

  try {
    if (!data.name) {
      throw new Error(knownErrors.invalidName);
    }

    if (!currencyCodes.includes(data.currency)) {
      throw new Error(knownErrors.invalidCurrency);
    }

    if (!timezoneCodes.includes(data.timezone)) {
      throw new Error(knownErrors.invalidTimezone);
    }

    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name
    });

    const family = await prisma.family.create({
      data: {
        name: data.name,
        ownerId: user.id,
        currency: data.currency,
        timezone: data.timezone,
        stripeCustomerId: customer.id,
        users: {
          create: {
            user: {
              connect: {
                id: user.id
              }
            }
          }
        }
      }
    });

    const {
      message,
      data: budget,
      success
    } = await createBudget({
      familyId: family.id,
      startDate: data.budgetStartDate,
      interval: data.budgetInterval,
      transferPouchBalance: data.budgetTransferPouchBalance
    });

    if (!success) {
      throw new Error(message);
    }

    if (!budget) {
      throw new Error(knownErrors.failedToCreateFamily);
    }

    await prisma.family.update({
      where: { id: family.id },
      data: {
        budget: {
          connect: {
            id: budget.id
          }
        }
      }
    });

    return {
      success: true,
      message: t('success'),
      data: family
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
      message: knownErrors.failedToCreateFamily
    };
  }
}
