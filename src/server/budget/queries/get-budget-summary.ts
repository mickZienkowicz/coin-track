'use server';

import { Income, Outcome, Pouch, PouchExpense } from '@prisma/client';
import { addHours, isWithinInterval, subHours } from 'date-fns';

import { getCurrentBudgetPeriod } from '@/lib/dates/get-current-budget-period';
import { getOccurrencesInTimeframe } from '@/lib/dates/get-occurances-in-timeframe';
import { getUtcMiddayDateOfGivenTimezone } from '@/lib/dates/get-utc-midday-date-of-given-date/get-utc-midday-date-of-given-timezone';
import { prisma } from '@/lib/prisma/prisma-client';

import { getBudget } from './get-budget';

const calculateOccurancesValueCentsSum = (
  items: {
    valueCents: number;
    occurrences: Date[];
  }[]
) => {
  return items.reduce((acc, item) => {
    return acc + item.valueCents * item.occurrences.length;
  }, 0);
};

export async function getBudgetSummary() {
  const budget = await getBudget();

  if (!budget) {
    return null;
  }

  const { startDate, endDate } = await getCurrentBudgetPeriod(
    budget.startDate,
    budget.interval,
    getUtcMiddayDateOfGivenTimezone(budget.family.timezone)
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
    balanceWithFullPouchesSum: incomesSum - outcomesSum - pouchesSum
  };
}
