import { fetchExchangeRates } from './ExchangeRateService';

describe('ExchangeRateService', () => {
  // 테스트 ID 1.1.1: 기본 API 호출
  test('fetchExchangeRates 함수는 USD를 기반으로 데이터를 반환해야 한다', async () => {
    // Given: fetch 함수를 모킹하여 성공적인 API 응답을 시뮬레이션
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        source: 'ExchangeRate-API',
        base: 'USD',
        rates: { KRW: 1350.25 },
      }),
    });
    
    // When: fetchExchangeRates 함수를 호출
    const data = await fetchExchangeRates();

    // Then: 반환된 데이터의 base는 'USD'이고, rates.KRW는 숫자여야 한다.
    expect(data.base).toBe('USD');
    expect(typeof data.rates.KRW).toBe('number');
  });

  // =======================================================
  // 바로 이 위치에 아래 코드를 붙여넣으시면 됩니다.
  // =======================================================

  // 테스트 ID 1.1.2: 주 API 실패 시 백업 전환
  test('주 API가 실패하면 백업 API를 호출하고 그 데이터를 반환해야 한다', async () => {
    // Given: fetch 함수를 모킹(가짜 함수로 대체)합니다.
    global.fetch = jest.fn();

    // 첫 번째 호출(주 API)은 실패하도록 설정
    fetch.mockResolvedValueOnce({
      ok: false,
    });

    // 두 번째 호출(백업 API)은 성공적인 샘플 데이터를 반환하도록 설정
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        source: 'CurrencyAPI', // 백업 API 출처 명시
        base: 'USD',
        rates: { KRW: 1360.00 },
      }),
    });

    // When: fetchExchangeRates 함수를 호출
    const data = await fetchExchangeRates();

    // Then: 최종 반환된 데이터의 source가 'CurrencyAPI'인지 확인
    expect(data.source).toBe('CurrencyAPI');
  });

  // 테스트 ID 1.1.3: 모든 API 실패 시 기본값 반환
  test('모든 API가 실패하면 기본 환율 데이터를 반환해야 한다', async () => {
    // Given: fetch 함수가 항상 실패하도록 모킹
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    // When: fetchExchangeRates 함수를 호출
    const data = await fetchExchangeRates();

    // Then: 반환된 데이터의 source가 'Default'인지 확인
    expect(data.source).toBe('Default');
    expect(data.base).toBe('USD');
  });

});
