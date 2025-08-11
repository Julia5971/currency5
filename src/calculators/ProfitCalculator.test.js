import { calculateProfitLoss } from './ProfitCalculator';

describe('ProfitCalculator', () => {
  // 테스트 ID 2.1.1: 환차익 계산
  test('매입가보다 현재가가 높을 때 올바른 환차익을 계산해야 한다', () => {
    // Given: 매입가 1300, 현재가 1350, 보유 금액 100 USD
    const purchasePrice = 1300;
    const currentPrice = 1350;
    const amount = 100;

    // When: calculateProfitLoss 함수를 호출
    const profit = calculateProfitLoss(purchasePrice, currentPrice, amount);

    // Then: 예상되는 환차익은 5000원
    expect(profit).toBe(5000);
  });

  // 테스트 ID 2.1.2: 환차손 계산
  test('매입가보다 현재가가 낮을 때 올바른 환차손을 계산해야 한다', () => {
    // Given: 매입가 1350, 현재가 1300, 보유 금액 100 USD
    const purchasePrice = 1350;
    const currentPrice = 1300;
    const amount = 100;

    // When: calculateProfitLoss 함수를 호출
    const loss = calculateProfitLoss(purchasePrice, currentPrice, amount);

    // Then: 예상되는 환차손은 -5000원
    expect(loss).toBe(-5000);
  });
});