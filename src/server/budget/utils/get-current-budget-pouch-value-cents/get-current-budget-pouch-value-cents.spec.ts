import {
  Budget,
  Interval,
  Pouch,
  PouchExpense,
  RecurrenceType
} from '@prisma/client';
import { addDays, subDays } from 'date-fns';

import { getCurrentBudgetPouchValueCents } from './get-current-budget-pouch-value-cents';

describe('getCurrentBudgetPouchValueCents', () => {
  const baseDate = new Date('2024-01-01');

  const mockBudget: Budget = {
    id: '1',
    familyId: '1',
    startDate: baseDate,
    interval: Interval.MONTH,
    transferPouchBalance: true,
    createdAt: baseDate,
    updatedAt: baseDate
  };

  const mockPouch: Pouch & { pouchExpenses: PouchExpense[] } = {
    id: '1',
    name: 'Test Pouch',
    budgetId: '1',
    date: baseDate,
    valueCents: 1000,
    recurrence: RecurrenceType.INFINITE,
    repeatEvery: Interval.MONTH,
    pouchExpenses: [],
    createdAt: addDays(baseDate, 1),
    updatedAt: addDays(baseDate, 1),
    repeatCount: null,
    category: 'Test Category',
    stoppedAt: null
  };

  it('should return original value when transferPouchBalance is false', async () => {
    const result = await getCurrentBudgetPouchValueCents({
      pouch: mockPouch,
      budget: { ...mockBudget, transferPouchBalance: false },
      today: addDays(baseDate, 60)
    });

    expect(result).toBe(1000);
  });

  it('should return original value for ONE_TIME pouch', async () => {
    const result = await getCurrentBudgetPouchValueCents({
      pouch: { ...mockPouch, recurrence: RecurrenceType.ONE_TIME },
      budget: mockBudget,
      today: addDays(baseDate, 60)
    });

    expect(result).toBe(1000);
  });

  it('should return original value when repeatEvery is null', async () => {
    const result = await getCurrentBudgetPouchValueCents({
      pouch: { ...mockPouch, repeatEvery: null },
      budget: mockBudget,
      today: addDays(baseDate, 60)
    });

    expect(result).toBe(1000);
  });

  it('should accumulate value over multiple intervals with no expenses', async () => {
    const today = new Date('2024-03-15');

    const result = await getCurrentBudgetPouchValueCents({
      pouch: mockPouch,
      budget: mockBudget,
      today
    });

    expect(result).toBe(3000);
  });

  it('should subtract past expenses from accumulated value', async () => {
    const startDate = new Date('2024-01-01');
    const today = new Date('2024-03-01');

    const pouchWithExpenses: Pouch & { pouchExpenses: PouchExpense[] } = {
      ...mockPouch,
      pouchExpenses: [
        {
          id: '1',
          pouchId: '1',
          name: 'Test Expense',
          date: subDays(startDate, 5),
          valueCents: 500,
          createdAt: baseDate,
          updatedAt: baseDate
        }
      ]
    };

    const result = await getCurrentBudgetPouchValueCents({
      pouch: pouchWithExpenses,
      budget: mockBudget,
      today
    });

    expect(result).toBe(2500);
  });

  it('should not subtract future expenses', async () => {
    const startDate = new Date('2024-01-01');
    const today = new Date('2024-03-01');

    const pouchWithFutureExpenses: Pouch & { pouchExpenses: PouchExpense[] } = {
      ...mockPouch,
      pouchExpenses: [
        {
          id: '1',
          pouchId: '1',
          name: 'Test Expense',
          date: addDays(startDate, 5),
          valueCents: 500,
          createdAt: baseDate,
          updatedAt: baseDate
        }
      ]
    };

    const result = await getCurrentBudgetPouchValueCents({
      pouch: pouchWithFutureExpenses,
      budget: mockBudget,
      today
    });

    expect(result).toBe(3000);
  });

  it('should handle zero intervals case', async () => {
    const result = await getCurrentBudgetPouchValueCents({
      pouch: mockPouch,
      budget: mockBudget,
      today: baseDate
    });

    expect(result).toBe(1000);
  });
});
