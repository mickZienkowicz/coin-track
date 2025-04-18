import {
  Income,
  Interval,
  Outcome,
  Pouch,
  PouchExpense,
  RecurrenceType
} from '@prisma/client';

import { getOccurrencesInTimeframe } from '@/lib/dates/get-occurances-in-timeframe';

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

export const getBudgetPeriodInfo = async ({
  startDate,
  endDate,
  incomes,
  outcomes,
  pouches,
  budgetInterval
}: {
  startDate: Date;
  endDate: Date;
  incomes: Income[];
  outcomes: Outcome[];
  pouches: (Pouch & { pouchExpenses: PouchExpense[] })[];
  budgetInterval: Interval;
}) => {
  const pouchExpenses = pouches.flatMap((pouch) =>
    pouch.pouchExpenses.map((pouchExpense) => ({
      ...pouchExpense,
      recurrence: RecurrenceType.ONE_TIME
    }))
  );

  const pouchExpenseOccurances = getOccurrencesInTimeframe(
    startDate,
    endDate,
    pouchExpenses
  );

  const incomeOccurances = getOccurrencesInTimeframe(
    startDate,
    endDate,
    incomes
  );

  const outcomeOccurances = getOccurrencesInTimeframe(
    startDate,
    endDate,
    outcomes
  );

  const totalIncomeValueCents =
    calculateOccurancesValueCentsSum(incomeOccurances);

  const totalOutcomeValueCents =
    calculateOccurancesValueCentsSum(outcomeOccurances);

  const totalPouchExpenseValueCents = calculateOccurancesValueCentsSum(
    pouchExpenseOccurances
  );

  return {
    startDate,
    endDate,
    interval: budgetInterval,
    outcomes: totalOutcomeValueCents + totalPouchExpenseValueCents,
    incomes: totalIncomeValueCents,
    balance:
      totalIncomeValueCents -
      totalOutcomeValueCents -
      totalPouchExpenseValueCents
  };
};
