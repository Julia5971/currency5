import { calculateProfitLoss } from './ProfitCalculator.js';

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

  // 테스트 ID 2.1.3: 유효하지 않은 입력 처리
  test('숫자가 아닌 값이 입력되면 NaN을 반환해야 한다', () => {
    // Given: 유효하지 않은 입력값
    const invalidInput = 'abc';
    const validPrice = 1300;
    const validAmount = 100;

    // When: 유효하지 않은 값으로 함수를 각각 호출
    const result1 = calculateProfitLoss(invalidInput, validPrice, validAmount);
    const result2 = calculateProfitLoss(validPrice, invalidInput, validAmount);
    const result3 = calculateProfitLoss(validPrice, validPrice, invalidInput);

    // Then: 모든 결과는 NaN이어야 한다
    expect(result1).toBeNaN();
    expect(result2).toBeNaN();
    expect(result3).toBeNaN();
  });
});