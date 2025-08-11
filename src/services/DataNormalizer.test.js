import { normalizeData } from './DataNormalizer';

describe('DataNormalizer', () => {
  // 테스트 ID 1.3.1: EUR 기반 데이터 변환
  test('EUR 기반 데이터를 USD 기반으로 정규화해야 한다', () => {
    // Given: EUR 기반의 샘플 데이터
    const eurData = {
      base: 'EUR',
      rates: {
        USD: 1.1,  // 1 EUR = 1.1 USD
        KRW: 1485, // 1 EUR = 1485 KRW
        JPY: 165   // 1 EUR = 165 JPY
      }
    };

    // When: normalizeData 함수로 데이터를 변환
    const usdData = normalizeData(eurData);

    // Then: base는 'USD'가 되어야 한다
    expect(usdData.base).toBe('USD');
    
    // and: 모든 환율은 USD 기준으로 재계산되어야 한다
    // 1 USD = 1 / 1.1 EUR
    // 1 KRW는 (1485 / 1.1) USD
    // 1 JPY는 (165 / 1.1) USD
    expect(usdData.rates.KRW).toBeCloseTo(1350); // 1485 / 1.1
    expect(usdData.rates.JPY).toBeCloseTo(150);  // 165 / 1.1
    expect(usdData.rates.EUR).toBeCloseTo(0.909); // 1 / 1.1
  });
});