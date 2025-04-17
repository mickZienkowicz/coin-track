export const getOccurancesAmounts = (
  totalAmount: number,
  numberOfPayments: number
): { regularAmount: number; lastAmount: number } => {
  if (numberOfPayments <= 0) {
    return { regularAmount: 0, lastAmount: 0 };
  }

  const regularAmount = Math.floor(totalAmount / numberOfPayments);
  const lastAmount = totalAmount - regularAmount * (numberOfPayments - 1);

  return { regularAmount, lastAmount };
};
