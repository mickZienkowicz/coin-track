import { isBefore, isWithinInterval, startOfDay } from 'date-fns';

export enum GoalOutcomeStatus {
  PLANNED = 'planned',
  IN_CURRENT_BUDGET = 'in-current-budget',
  COMPLETED = 'completed'
}

export function getGoalOutcomeStatus(
  outcomeDate: Date,
  budgetStartDate: Date,
  budgetEndDate: Date
): GoalOutcomeStatus {
  const normalizedOutcomeDate = startOfDay(outcomeDate);
  const normalizedStartDate = startOfDay(budgetStartDate);
  const normalizedEndDate = startOfDay(budgetEndDate);

  if (isBefore(normalizedOutcomeDate, normalizedStartDate)) {
    return GoalOutcomeStatus.COMPLETED;
  }

  if (
    isWithinInterval(normalizedOutcomeDate, {
      start: normalizedStartDate,
      end: normalizedEndDate
    })
  ) {
    return GoalOutcomeStatus.IN_CURRENT_BUDGET;
  }

  return GoalOutcomeStatus.PLANNED;
}
