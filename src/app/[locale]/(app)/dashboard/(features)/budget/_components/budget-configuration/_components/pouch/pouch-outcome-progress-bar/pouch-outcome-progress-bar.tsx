import { Progress } from '@/components/ui/progress';
import type { PouchWithCurrentBudgetOccurance } from '@/server/budget/types';

type ProgressBarProps = {
  value: number;
  excess: number;
  isOverBudget: boolean;
};

type ProgressCalculation = {
  currentProgress: number;
  newProgress: number;
};

interface PouchOutcomeProgressBarProps {
  pouch: PouchWithCurrentBudgetOccurance;
  outcome?: number;
}

const calculatePouchCapacity = (
  pouch: PouchWithCurrentBudgetOccurance
): number => {
  return (
    pouch.valueCents +
    pouch.eachOccuranceValueCents * (pouch.occurrences.length - 1)
  );
};

const calculateCurrentExpenses = (
  pouch: PouchWithCurrentBudgetOccurance
): number => {
  return pouch.pouchExpenses.reduce(
    (acc, expense) => acc + expense.valueCents,
    0
  );
};

const calculateNewFullCapacity = (
  pouchCapacity: number,
  currentExpenses: number,
  newExpenseValue: number
): number => {
  return pouchCapacity + (currentExpenses + (newExpenseValue - pouchCapacity));
};

const calculateProgress = (
  currentExpenses: number,
  newExpenseValue: number,
  pouchCapacity: number
): ProgressCalculation => {
  const totalNewExpenses = currentExpenses + newExpenseValue;

  return {
    currentProgress:
      currentExpenses <= 0 ? 0 : (currentExpenses / pouchCapacity) * 100,
    newProgress:
      totalNewExpenses <= 0 ? 0 : (totalNewExpenses / pouchCapacity) * 100
  };
};

const calculateOverBudgetProgress = (
  currentExpenses: number,
  pouchCapacity: number,
  newFullCapacity: number
): ProgressCalculation => {
  return {
    currentProgress:
      newFullCapacity >= 0 ? (currentExpenses / newFullCapacity) * 100 : 0,
    newProgress:
      newFullCapacity >= 0 ? (pouchCapacity / newFullCapacity) * 100 : 0
  };
};

const ProgressBar = ({ value, excess, isOverBudget }: ProgressBarProps) => (
  <Progress
    value={value}
    excess={excess}
    className={isOverBudget ? 'bg-red-300/90' : undefined}
    progressBarClassName={`bg-blue-${isOverBudget ? '500' : '600'}`}
    excessBarClassName={isOverBudget ? 'bg-red-700' : 'bg-blue-100/90'}
  />
);

export const PouchOutcomeProgressBar = ({
  pouch,
  outcome = 0
}: PouchOutcomeProgressBarProps) => {
  const pouchCapacity = calculatePouchCapacity(pouch);
  const currentExpenses = calculateCurrentExpenses(pouch);
  const newExpenseValue = outcome * 100;

  const { currentProgress, newProgress } = calculateProgress(
    currentExpenses,
    newExpenseValue,
    pouchCapacity
  );

  if (currentProgress > 100) {
    const newFullCapacity = calculateNewFullCapacity(
      pouchCapacity,
      currentExpenses,
      newExpenseValue
    );

    const overBudgetProgress = calculateOverBudgetProgress(
      pouchCapacity,
      currentExpenses,
      newFullCapacity
    );

    return (
      <ProgressBar
        value={overBudgetProgress.currentProgress}
        excess={overBudgetProgress.newProgress}
        isOverBudget={true}
      />
    );
  }

  if (newProgress > 100) {
    const newFullCapacity = calculateNewFullCapacity(
      pouchCapacity,
      currentExpenses,
      newExpenseValue
    );

    const overBudgetProgress = calculateOverBudgetProgress(
      currentExpenses,
      pouchCapacity,
      newFullCapacity
    );

    return (
      <ProgressBar
        value={overBudgetProgress.currentProgress}
        excess={overBudgetProgress.newProgress}
        isOverBudget={true}
      />
    );
  }

  return (
    <ProgressBar
      value={currentProgress}
      excess={newProgress}
      isOverBudget={false}
    />
  );
};
