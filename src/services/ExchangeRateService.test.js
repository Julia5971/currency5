import { fetchExchangeRates } from './ExchangeRateService.js';

describe('ExchangeRateService', () => {

  // beforeEach: 각 테스트가 실행되기 직전에 항상 이 코드를 먼저 실행합니다.
  beforeEach(() => {
    localStorage.clear(); // localStorage를 깨끗하게 비웁니다.
    jest.clearAllMocks(); // 모든 모킹된 함수들을 초기화합니다.
  });

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

  // 테스트 ID 1.2.2: API 실패 시 데이터 복원
  test('모든 API가 실패해도 localStorage에 유효한 데이터가 있으면 그 데이터를 반환해야 한다', async () => {
    // Given: 모든 API 호출은 실패하도록 모킹
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    // And: localStorage에는 유효한 (1시간 전) 백업 데이터가 존재
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const backupData = {
      base: 'USD',
      rates: { KRW: 1380.00 },
      timestamp: oneHourAgo,
      source: 'localStorage-backup'
    };
    localStorage.setItem('exchange-rate-backup', JSON.stringify(backupData));

    // When: fetchExchangeRates 함수를 호출
    const data = await fetchExchangeRates();

    // Then: localStorage에서 읽어온 데이터를 반환해야 한다
    expect(data.source).toBe('localStorage-backup');
    expect(data.rates.KRW).toBe(1380.00);
  });

  // 테스트 ID 1.2.3: 만료된 데이터 미사용
  test('localStorage의 백업 데이터가 24시간을 초과하면 사용하지 않아야 한다', async () => {
    // Given: 모든 API 호출은 실패
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    // And: localStorage에는 만료된 (30시간 전) 데이터가 존재
    const thirtyHoursAgo = Date.now() - 30 * 60 * 60 * 1000;
    const expiredBackupData = {
      base: 'USD',
      rates: { KRW: 1399.00 },
      timestamp: thirtyHoursAgo,
      source: 'expired-backup'
    };
    localStorage.setItem('exchange-rate-backup', JSON.stringify(expiredBackupData));

    // When: fetchExchangeRates 함수를 호출
    const data = await fetchExchangeRates();

    // Then: 백업 데이터를 사용하지 않고, 기본 데이터를 반환해야 한다
    expect(data.source).toBe('Default');
  });
});
