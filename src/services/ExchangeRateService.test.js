import { fetchExchangeRates } from './ExchangeRateService';

describe('ExchangeRateService', () => {
  // 테스트 ID 1.1.1: 기본 API 호출
  test('fetchExchangeRates 함수는 USD를 기반으로 데이터를 반환해야 한다', async () => {
    // Given
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ source: 'ExchangeRate-API', base: 'USD', rates: { KRW: 1350.25 } }),
    });
    
    // When
    const data = await fetchExchangeRates();

    // Then
    expect(data.base).toBe('USD');
    expect(typeof data.rates.KRW).toBe('number');
  });

  // 테스트 ID 1.1.2: 주 API 실패 시 백업 전환
  test('주 API가 실패하면 백업 API를 호출하고 그 데이터를 반환해야 한다', async () => {
    // Given
    global.fetch = jest.fn();
    fetch.mockResolvedValueOnce({ ok: false });
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ source: 'CurrencyAPI', base: 'USD', rates: { KRW: 1360.00 } }),
    });

    // When
    const data = await fetchExchangeRates();

    // Then
    expect(data.source).toBe('CurrencyAPI');
  });

  // 테스트 ID 1.1.3: 모든 API 실패 시 기본값 반환
  test('모든 API가 실패하면 기본 환율 데이터를 반환해야 한다', async () => {
    // Given
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    // When
    const data = await fetchExchangeRates();

    // Then
    expect(data.source).toBe('Default');
    expect(data.base).toBe('USD');
  });

  // 테스트 ID 1.2.1: 성공 시 데이터 백업
  test('API 호출에 성공하면 localStorage에 데이터를 백업해야 한다', async () => {
    // Given
    const mockData = { base: 'USD', rates: { KRW: 1370.50 } };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });
    jest.spyOn(localStorage, 'setItem');

    // When
    await fetchExchangeRates();

    // Then
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'exchange-rate-backup',
      expect.stringContaining('"timestamp"')
    );
  });
});
