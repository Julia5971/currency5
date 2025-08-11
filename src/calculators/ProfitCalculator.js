export const calculateProfitLoss = (purchasePrice, currentPrice, amount) => {
  const profitPerUnit = currentPrice - purchasePrice;
  return profitPerUnit * amount;
};