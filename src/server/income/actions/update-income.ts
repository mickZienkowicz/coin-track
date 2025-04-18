'use server';

import { RecurrenceType } from '@prisma/client';
import { getTranslations } from 'next-intl/server';

import { prisma } from '@/lib/prisma/prisma-client';
import { getAuthenticatedUser } from '@/server/utils/get-authenticated-user';

import {
  updateIncomeSchema,
  updateOneTimeIncomeSchema
} from '../schemas/update-income-schema';

export async function updateIncome({
  id,
  data
}: {
  id: string;
  data: {
    name: string;
    category: string;
    date?: Date;
    valueCents?: number;
  };
}) {
  const t = await getTranslations('errors.income.update');
  const user = await getAuthenticatedUser();

  const knownErrors = {
    failedToUpdateIncome: t('failedToUpdateIncome'),
    incomeNotFound: t('incomeNotFound'),
    incomeNotBelongsToUser: t('incomeNotBelongsToUser'),
    invalidIncomeData: t('invalidIncomeData')
  };

  try {
    const income = await prisma.income.findUnique({
      where: {
        id
      },
      include: {
        budget: {
          include: {
            family: {
              include: {
                users: true
              }
            }
          }
        }
      }
    });

    if (!income) {
      throw new Error(knownErrors.incomeNotFound);
    }

    const isIncomeBelongsToUser = income.budget.family.users.some(
      (familyUser) => familyUser.userId === user.id
    );

    if (!isIncomeBelongsToUser) {
      throw new Error(knownErrors.incomeNotBelongsToUser);
    }

    if (income.recurrence === RecurrenceType.ONE_TIME) {
      if (!updateOneTimeIncomeSchema.safeParse(data).success) {
        throw new Error(knownErrors.invalidIncomeData);
      }

      const updatedIncome = await prisma.income.update({
        where: {
          id
        },
        data: {
          name: data.name,
          category: data.category,
          date: data.date || income.date,
          valueCents: data.valueCents || income.valueCents
        }
      });

      return {
        success: true,
        message: t('success'),
        data: updatedIncome
      };
    }

    if (!updateIncomeSchema.safeParse(data).success) {
      throw new Error(knownErrors.invalidIncomeData);
    }

    const updatedIncome = await prisma.income.update({
      where: {
        id
      },
      data: {
        name: data.name,
        category: data.category
      }
    });

    return {
      success: true,
      message: t('success'),
      data: updatedIncome
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
      message: isKnownError ? error.message : knownErrors.failedToUpdateIncome
    };
  }
}
