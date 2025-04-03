'use server';

import { Pouch, PouchExpense } from '@prisma/client';
import { addHours, isWithinInterval, subHours } from 'date-fns';

import { getCurrentBudgetPeriod } from '@/lib/dates/get-current-budget-period';
import { getOccurrencesInTimeframe } from '@/lib/dates/get-occurances-in-timeframe';
import { getUtcMiddayDateOfGivenTimezone } from '@/lib/dates/get-utc-midday-date-of-given-date/get-utc-midday-date-of-given-timezone';
import { prisma } from '@/lib/prisma/prisma-client';

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

  const pouchOccurances = getOccurrencesInTimeframe<
    Pouch & {
      pouchExpenses: PouchExpense[];
    }
  >(startDate, endDate, pouches).map((pouch) => ({
    ...pouch,
    pouchExpenses: pouch.pouchExpenses.filter((expense) =>
      isWithinInterval(expense.date, {
        start: subHours(startDate, 3),
        end: addHours(endDate, 3)
      })
    )
  }));

  return pouchOccurances;
}
