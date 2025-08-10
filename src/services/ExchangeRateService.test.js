import { fetchExchangeRates } from './ExchangeRateService';

describe('ExchangeRateService', () => {
  // 테스트 ID 1.1.1: 기본 API 호출
  test('fetchExchangeRates 함수는 USD를 기반으로 데이터를 반환해야 한다', async () => {
    // Given: API 호출이 성공할 것이라 가정 (여기서는 아직 모킹 없음)
    
    // When: fetchExchangeRates 함수를 호출
    const data = await fetchExchangeRates();

    // Then: 반환된 데이터의 base는 'USD'이고, rates.KRW는 숫자여야 한다.
    expect(data.base).toBe('USD');
    expect(typeof data.rates.KRW).toBe('number');
  });
});
