'use server';

import { Pouch, PouchExpense } from '@prisma/client';
import { addHours, isWithinInterval, subHours } from 'date-fns';

import { getCurrentBudgetPeriod } from '@/lib/dates/get-current-budget-period';
import { getOccurrencesInTimeframe } from '@/lib/dates/get-occurances-in-timeframe';
import { getUtcMiddayDateOfGivenDate } from '@/lib/dates/get-utc-midday-date-of-given-date';
import { getUtcMiddayDateOfGivenTimezone } from '@/lib/dates/get-utc-midday-date-of-given-date/get-utc-midday-date-of-given-timezone';
import { prisma } from '@/lib/prisma/prisma-client';

import { getCurrentBudgetPouchValueCents } from '../utils/get-current-budget-pouch-value-cents';
import { getBudget } from './get-budget';

export async function getCurrentBudgetPouches() {
  const budget = await getBudget();

  if (!budget) {
    return null;
  }

  const { startDate, endDate } = await getCurrentBudgetPeriod(
    budget.startDate,
    budget.interval,
    getUtcMiddayDateOfGivenTimezone(budget.family.timezone)
  );

  const pouches = await prisma.pouch.findMany({
    where: { budgetId: budget.id },
    include: { pouchExpenses: true }
  });

  const pouchOccurances = await Promise.all(
    getOccurrencesInTimeframe<
      Pouch & {
        pouchExpenses: PouchExpense[];
      }
    >(startDate, endDate, pouches).map(async (pouch) => ({
      ...pouch,
      eachOccuranceValueCents: pouch.valueCents,
      valueCents: await getCurrentBudgetPouchValueCents({
        pouch,
        budget,
        today: getUtcMiddayDateOfGivenDate(new Date())
      }),
      pouchExpenses: pouch.pouchExpenses.filter((expense) =>
        isWithinInterval(expense.date, {
          start: subHours(startDate, 3),
          end: addHours(endDate, 3)
        })
      )
    }))
  );

  return pouchOccurances;
}
