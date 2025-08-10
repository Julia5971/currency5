// src/services/ExchangeRateService.js

const API_ENDPOINTS = [
  { name: 'ExchangeRate-API', url: 'https://open.er-api.com/v6/latest/USD' },
  { name: 'CurrencyAPI', url: 'https://api.currencyapi.com/v3/latest?apikey=YOUR_API_KEY&base_currency=USD' },
];

const getDefaultRates = () => {
  console.log('모든 API 호출에 실패하여 기본 환율 정보를 반환합니다.');
  return {
    base: 'USD',
    rates: { KRW: 1300.00 }, // 기본값
    source: 'Default',
  };
};

export const fetchExchangeRates = async () => {
  for (const api of API_ENDPOINTS) {
    try {
      const response = await fetch(api.url);
      if (response.ok) {
        console.log(`'${api.name}'에서 데이터를 성공적으로 가져왔습니다.`);
        const data = await response.json();
        return { ...data, source: api.name };
      }
    } catch (error) {
      console.error(`'${api.name}' API 호출 실패:`, error.message);
    }
  }

  return getDefaultRates();
};