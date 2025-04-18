import { Budget, Pouch, PouchExpense, RecurrenceType } from '@prisma/client';
import { isBefore, subHours } from 'date-fns';

import { getCurrentBudgetPeriod } from '@/lib/dates/get-current-budget-period';
import { getOccurrencesInTimeframe } from '@/lib/dates/get-occurances-in-timeframe';
import { getUtcMiddayDateOfGivenDate } from '@/lib/dates/get-utc-midday-date-of-given-date';

export const getCurrentBudgetPouchValueCents = async ({
  pouch,
  budget,
  today
}: {
  pouch: Pouch & { pouchExpenses: PouchExpense[] };
  budget: Budget;
  today: Date;
}): Promise<number> => {
  if (!budget.transferPouchBalance) {
    return pouch.valueCents;
  }

  if (pouch.recurrence === RecurrenceType.ONE_TIME || !pouch?.repeatEvery) {
    return pouch.valueCents;
  }

  const { startDate } = await getCurrentBudgetPeriod(
    budget.startDate,
    budget.interval,
    today
  );

  const pouchWithOccurances = getOccurrencesInTimeframe<Pouch>(
    pouch.date,
    subHours(startDate, 30),
    [pouch]
  );

  const occurancesBeforeCurrentBudgetCount =
    pouchWithOccurances.at(0)?.occurrences.length ?? 0;
  const totalAccumulatedValue =
    pouch.valueCents * occurancesBeforeCurrentBudgetCount;

  const expensesSum = pouch.pouchExpenses
    .filter((expense) =>
      isBefore(expense.date, getUtcMiddayDateOfGivenDate(startDate))
    )
    .reduce((sum, expense) => sum + expense.valueCents, 0);

  return totalAccumulatedValue - expensesSum + pouch.valueCents;
};
