import { DeveloperModeService } from '../services/DeveloperModeService.js';

const developerMode = new DeveloperModeService();

export const calculateProfitLoss = (purchasePrice, currentPrice, amount) => {
  developerMode.logIfDeveloperMode('환차손익 계산 시작:', { purchasePrice, currentPrice, amount });
  
  const profitPerUnit = currentPrice - purchasePrice;
  const result = profitPerUnit * amount;
  
  developerMode.logIfDeveloperMode('환차손익 계산 완료:', { profitPerUnit, result });
  
  return result;
};