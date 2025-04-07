import { Goal, Interval, Outcome, RecurrenceType } from '@prisma/client';

const outcomes: (Outcome & { timeBadge: string })[] = [
  {
    id: '1',
    name: 'Wpłata na cel',
    valueCents: 200000,
    createdAt: new Date(),
    updatedAt: new Date(),
    date: new Date(),
    recurrence: RecurrenceType.ONE_TIME,
    repeatCount: 1,
    repeatEvery: Interval.MONTH,
    goalId: '1',
    budgetId: '1',
    category: '1',
    stoppedAt: null,

    timeBadge: 'future'
  },
  {
    id: '2',
    name: 'Wpłata na cel',
    valueCents: 110000,
    createdAt: new Date(),
    updatedAt: new Date(),
    date: new Date(),
    recurrence: RecurrenceType.ONE_TIME,
    repeatCount: 1,
    repeatEvery: Interval.MONTH,
    goalId: '1',
    budgetId: '1',
    category: '1',
    stoppedAt: null,

    timeBadge: 'currentBudget'
  },
  {
    id: '3',
    name: 'Wpłata na cel',
    valueCents: 60000,
    createdAt: new Date(),
    updatedAt: new Date(),
    date: new Date(),
    recurrence: RecurrenceType.ONE_TIME,
    repeatCount: 1,
    repeatEvery: Interval.MONTH,
    goalId: '1',
    budgetId: '1',
    category: '1',
    stoppedAt: null,
    timeBadge: 'past'
  }
];

export const goals: (Goal & {
  goalBudgetOutcomes: (Outcome & { timeBadge: string })[];
})[] = [
  {
    id: '1',
    familyId: '1',
    name: 'Kuchnia',
    valueCents: 2000000,
    initialDepositCents: 200000,
    endDate: new Date(),
    savingInterval: Interval.MONTH,
    createdAt: new Date(),
    updatedAt: new Date(),
    goalBudgetOutcomes: outcomes,
    withBudgetOutcomes: true
  },
  {
    id: '2',
    familyId: '1',
    name: 'Kanapa',
    valueCents: 1100000,
    initialDepositCents: 500000,
    endDate: new Date(),
    savingInterval: Interval.MONTH,
    createdAt: new Date(),
    updatedAt: new Date(),
    goalBudgetOutcomes: outcomes,
    withBudgetOutcomes: true
  },
  {
    id: '3',
    familyId: '1',
    name: 'Działka',
    valueCents: 600000,
    initialDepositCents: 50000,
    endDate: new Date(),
    savingInterval: Interval.MONTH,
    createdAt: new Date(),
    updatedAt: new Date(),
    goalBudgetOutcomes: outcomes,
    withBudgetOutcomes: false
  },
  {
    id: '4',
    familyId: '1',
    name: 'Wakacje',
    valueCents: 400000,
    initialDepositCents: 40000,
    endDate: new Date(),
    savingInterval: Interval.MONTH,
    createdAt: new Date(),
    updatedAt: new Date(),
    goalBudgetOutcomes: outcomes,
    withBudgetOutcomes: false
  }
];
