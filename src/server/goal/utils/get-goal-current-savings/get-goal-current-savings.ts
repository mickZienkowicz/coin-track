import { Outcome } from '@prisma/client';

import { getGoalOutcomeStatus } from '../get-goal-outcome-status';
import { GoalOutcomeStatus } from '../get-goal-outcome-status/get-goal-outcome-status';

export const getGoalCurrentSavings = (
  goalOutcomes: Outcome[],
  budgetStartDate: Date,
  budgetEndDate: Date,
  initialDepositCents: number
) => {
  return (
    goalOutcomes.reduce((acc, outcome) => {
      const outcomeStatus = getGoalOutcomeStatus(
        outcome.date,
        budgetStartDate,
        budgetEndDate
      );
      if (
        outcomeStatus === GoalOutcomeStatus.IN_CURRENT_BUDGET ||
        outcomeStatus === GoalOutcomeStatus.COMPLETED
      ) {
        return acc + outcome.valueCents;
      }
      return acc;
    }, 0) + initialDepositCents
  );
};
