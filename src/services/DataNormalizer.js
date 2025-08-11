export const normalizeData = (data) => {
  if (data.base === 'USD') {
    return data; // 이미 USD 기반이면 그대로 반환
  }

  if (data.base === 'EUR') {
    const usdRate = data.rates.USD;
    if (!usdRate) {
      throw new Error('USD 환율 정보가 없어 변환할 수 없습니다.');
    }

    const newRates = {};
    for (const currency in data.rates) {
      newRates[currency] = data.rates[currency] / usdRate;
    }
    // EUR 자신에 대한 환율 추가
    newRates.EUR = 1 / usdRate;

    return {
      base: 'USD',
      rates: newRates,
    };
  }

  // 지원하지 않는 다른 base 통화
  throw new Error(`${data.base} 기반 데이터는 지원하지 않습니다.`);
};