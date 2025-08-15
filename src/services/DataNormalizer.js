import developerMode from './DeveloperModeService.js';

export const normalizeData = (data) => {
  developerMode.logIfDeveloperMode('데이터 정규화 시작:', { base: data.base, ratesCount: Object.keys(data.rates).length });
  
  if (data.base === 'USD') {
    developerMode.logIfDeveloperMode('이미 USD 기반 데이터입니다.');
    return data; // 이미 USD 기반이면 그대로 반환
  }

  if (data.base === 'EUR') {
    developerMode.logIfDeveloperMode('EUR 기반 데이터를 USD로 변환합니다.');
    
    const usdRate = data.rates.USD;
    if (!usdRate) {
      developerMode.logIfDeveloperMode('USD 환율 정보가 없어 변환할 수 없습니다.');
      throw new Error('USD 환율 정보가 없어 변환할 수 없습니다.');
    }

    const newRates = {};
    for (const currency in data.rates) {
      newRates[currency] = data.rates[currency] / usdRate;
    }
    // EUR 자신에 대한 환율 추가
    newRates.EUR = 1 / usdRate;

    developerMode.logIfDeveloperMode('EUR → USD 변환 완료:', { originalCount: Object.keys(data.rates).length, convertedCount: Object.keys(newRates).length });

    return {
      base: 'USD',
      rates: newRates,
    };
  }

  // 지원하지 않는 다른 base 통화
  developerMode.logIfDeveloperMode(`지원하지 않는 base 통화: ${data.base}`);
  throw new Error(`${data.base} 기반 데이터는 지원하지 않습니다.`);
};