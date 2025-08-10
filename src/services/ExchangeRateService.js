// src/services/ExchangeRateService.js

const API_ENDPOINTS = [
  'https://open.er-api.com/v6/latest/USD', // 1순위: ExchangeRate-API
  'https://api.currencyapi.com/v3/latest?apikey=YOUR_API_KEY&base_currency=USD' // 2순위: CurrencyAPI (나중에 실제 키로 변경 필요)
];

export const fetchExchangeRates = async () => {
  // 1순위 API 시도
  try {
    const response = await fetch(API_ENDPOINTS[0]);
    if (response.ok) {
      const data = await response.json();
      // 테스트를 위해 임시로 source 필드 추가
      return { ...data, source: 'ExchangeRate-API' };
    }
  } catch (error) {
    console.error('1순위 API 호출 실패:', error);
  }

  // 2순위 API 시도
  try {
    const response = await fetch(API_ENDPOINTS[1]);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('2순위 API 호출 실패:', error);
  }

  // 모든 API 실패 시 기본값 반환 (다음 테스트에서 구현 예정)
  return { base: 'USD', rates: { KRW: 1350.25 } };
};