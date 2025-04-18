'use server';

import { auth } from '@clerk/nextjs/server';
import { Income, Outcome, Pouch, PouchExpense } from '@prisma/client';
import { addHours, isWithinInterval, subHours } from 'date-fns';
import { getLocale } from 'next-intl/server';

import { redirect } from '@/i18n/navigation';
import { getCurrentBudgetPeriod } from '@/lib/dates/get-current-budget-period';
import { getOccurrencesInTimeframe } from '@/lib/dates/get-occurances-in-timeframe';
import { getUtcMiddayDateOfGivenDate } from '@/lib/dates/get-utc-midday-date-of-given-date';
import { getUtcMiddayDateOfGivenTimezone } from '@/lib/dates/get-utc-midday-date-of-given-date/get-utc-midday-date-of-given-timezone';
import { pathGenerators } from '@/lib/paths';
import { prisma } from '@/lib/prisma/prisma-client';

import { getCurrentBudgetPouchValueCents } from '../utils/get-current-budget-pouch-value-cents';
import { getBudget } from './get-budget';

const calculateOccurancesValueCentsSum = (
  items: {
    valueCents: number;
    eachOccuranceValueCents?: number;
    occurrences: Date[];
  }[]
) => {
  return items.reduce((acc, item) => {
    if (!item.eachOccuranceValueCents) {
      return acc + item.valueCents;
    }

    return (
      acc +
      item.valueCents +
      item.eachOccuranceValueCents * (item.occurrences.length - 1)
    );
  }, 0);
};

export async function getBudgetSummary(date?: Date) {
  const budget = await getBudget();

  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    const locale = await getLocale();
    redirect({ href: pathGenerators.home(), locale });
    throw new Error('Unauthorized');
  }

  if (!budget) {
    return null;
  }

  const { startDate, endDate } = await getCurrentBudgetPeriod(
    budget.startDate,
    budget.interval,
    getUtcMiddayDateOfGivenTimezone(budget.family.timezone, date)
  );

  const outcomes = await prisma.outcome.findMany({
    where: { budgetId: budget.id }
  });

  const incomes = await prisma.income.findMany({
    where: { budgetId: budget.id }
  });

  const pouches = await prisma.pouch.findMany({
    where: { budgetId: budget.id },
    include: { pouchExpenses: true }
  });

  const incomeOccurances = getOccurrencesInTimeframe<Income>(
    startDate,
    endDate,
    incomes
  );

  const outcomeOccurances = getOccurrencesInTimeframe<Outcome>(
    startDate,
    endDate,
    outcomes
  );

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
        today: getUtcMiddayDateOfGivenDate(date || new Date())
      }),
      pouchExpenses: pouch.pouchExpenses.filter((expense) =>
        isWithinInterval(expense.date, {
          start: subHours(startDate, 3),
          end: addHours(endDate, 3)
        })
      )
    }))
  );

  const incomesSum = calculateOccurancesValueCentsSum(incomeOccurances);
  const outcomesSum = calculateOccurancesValueCentsSum(outcomeOccurances);
  const pouchesSum = calculateOccurancesValueCentsSum(pouchOccurances);

  const pouchesOutcomesSum = pouchOccurances.reduce(
    (acc, pouch) =>
      acc +
      pouch.pouchExpenses.reduce((acc, expense) => acc + expense.valueCents, 0),
    0
  );

  return {
    budget,
    startDate,
    endDate,
    pouchOccurances,
    pouchesSum,
    pouchesOutcomesSum,
    incomesSum,
    incomeOccurances,
    outcomesSum,
    outcomeOccurances,
    balance: incomesSum - outcomesSum - pouchesOutcomesSum,
    balanceWithFullPouchesSum: incomesSum - outcomesSum - pouchesSum,
    isTransferingPouchesBalance: budget.transferPouchBalance
  };
}
