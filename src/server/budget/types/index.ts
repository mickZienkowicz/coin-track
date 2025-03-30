import type { Income, Outcome, Pouch, PouchExpense } from '@prisma/client';

import { getBudgetSummary } from '../queries/get-budget-summary';

export type BudgetSummaryResponse = Awaited<
  ReturnType<typeof getBudgetSummary>
>;

export type PouchWithCurrentBudgetOccurance = Pouch & {
  pouchExpenses: PouchExpense[];
  occurrences: Date[];
};
export type IncomeWithCurrentBudgetOccurance = Income & {
  occurrences: Date[];
};
export type OutcomeWithCurrentBudgetOccurance = Outcome & {
  occurrences: Date[];
};
