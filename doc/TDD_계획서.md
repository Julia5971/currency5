# 🧪 TDD (테스트 주도 개발) 계획서

이 문서는 '실시간 환율 정보 및 분석 웹 서비스'를 테스트 주도 개발(TDD) 방법론에 따라 개발하기 위한 테스트 케이스와 절차를 정의합니다. 개발은 **Red(실패) -> Green(성공) -> Refactor(개선)** 사이클을 따릅니다.

## 🎯 핵심 기능 테스트 계획

### 1. ExchangeRateService 테스트

#### 1.1 API 연동 및 데이터 처리

| 테스트 ID | 기능 명세 | 테스트 시나리오 (Given-When-Then) |
| :--- | :--- | :--- |
| **1.1.1** | **기본 API 호출** | **Given:** `ExchangeRate-API` 호출이 성공할 것이라 가정 (fetch 모킹)<br>**When:** `fetchExchangeRates()` 메서드 호출<br>**Then:** 반환된 데이터의 `base`가 'USD'이고, `rates.KRW` 값이 숫자인지 확인 |
| **1.1.2** | **주 API 실패 시 백업 전환** | **Given:** `ExchangeRate-API`(1순위) 호출은 실패, `CurrencyAPI`(2순위) 호출은 성공하도록 모킹<br>**When:** `fetchExchangeRates()` 호출<br>**Then:** 최종 반환된 데이터의 `source`가 'CurrencyAPI'인지 확인 |
| **1.1.3** | **모든 API 실패** | **Given:** 모든 API 호출이 실패하도록 모킹<br>**When:** `fetchExchangeRates()` 호출<br>**Then:** `getDefaultRates()`가 제공하는 기본 객체를 반환하는지 확인 |

#### 1.2 로컬 스토리지 백업/복원

| 테스트 ID | 기능 명세 | 테스트 시나리오 (Given-When-Then) |
| :--- | :--- | :--- |
| **1.2.1** | **성공 시 데이터 백업** | **Given:** API 호출이 성공적으로 데이터를 가져옴<br>**When:** `fetchExchangeRates()`가 성공적으로 실행된 후<br>**Then:** `localStorage`에 'exchange-rate-backup' 키로 데이터가 저장되었는지 확인 |
| **1.2.2** | **API 실패 시 데이터 복원** | **Given:** 모든 API 호출이 실패하고, `localStorage`에 유효한(24시간 이내) 백업 데이터가 존재함<br>**When:** `fetchExchangeRates()` 호출<br>**Then:** `localStorage`에서 읽어온 데이터를 반환하는지 확인 |
| **1.2.3** | **만료된 데이터 미사용** | **Given:** 모든 API 호출이 실패하고, `localStorage`의 백업 데이터가 24시간을 초과함<br>**When:** `fetchExchangeRates()` 호출<br>**Then:** 백업 데이터를 사용하지 않고, `getDefaultRates()`의 기본값을 반환하는지 확인 |

#### 1.3 데이터 정규화 (Normalization)

| 테스트 ID | 기능 명세 | 테스트 시나리오 (Given-When-Then) |
| :--- | :--- | :--- |
| **1.3.1** | **EUR 기반 데이터 변환** | **Given:** `Fixer.io`(EUR 기준)의 샘플 응답을 모킹<br>**When:** `normalizeData()` 메서드에 해당 데이터를 전달<br>**Then:** 반환된 데이터의 `base`가 'USD'이고, 모든 환율이 USD 기준으로 재계산되었는지 확인 |

### 2. ProfitCalculator 테스트

| 테스트 ID | 기능 명세 | 테스트 시나리오 (Given-When-Then) |
| :--- | :--- | :--- |
| **2.1.1** | **환차익 계산** | **Given:** 매입가 1300, 현재가 1350, 금액 100<br>**When:** `calculateProfitLoss(1300, 1350, 100)` 호출<br>**Then:** `5000`을 반환 |
| **2.1.2** | **환차손 계산** | **Given:** 매입가 1350, 현재가 1300, 금액 100<br>**When:** `calculateProfitLoss(1350, 1300, 100)` 호출<br>**Then:** `-5000`을 반환 |
| **2.1.3** | **유효하지 않은 입력 처리** | **Given:** 매입가에 숫자가 아닌 'abc' 입력<br>**When:** `calculateProfitLoss('abc', 1300, 100)` 호출<br>**Then:** 에러를 발생시키거나 `NaN`을 반환 |

### 3. DeveloperModeService 테스트

| 테스트 ID | 기능 명세 | 테스트 시나리오 (Given-When-Then) |
| :--- | :--- | :--- |
| **3.1.1** | **개발자 모드 감지** | **Given:** 개발자 도구가 열린 상태 (창 크기 차이 > 100px)<br>**When:** `isDeveloperModeEnabled()` 호출<br>**Then:** `true`를 반환 |
| **3.1.2** | **일반 모드 감지** | **Given:** 개발자 도구가 닫힌 상태 (창 크기 차이 < 100px)<br>**When:** `isDeveloperModeEnabled()` 호출<br>**Then:** `false`를 반환 |
| **3.1.3** | **조건부 로그 출력** | **Given:** 개발자 모드가 활성화된 상태<br>**When:** `logIfDeveloperMode('테스트 메시지')` 호출<br>**Then:** `console.log`가 호출됨 |
| **3.1.4** | **일반 모드에서 로그 미출력** | **Given:** 개발자 모드가 비활성화된 상태<br>**When:** `logIfDeveloperMode('테스트 메시지')` 호출<br>**Then:** `console.log`가 호출되지 않음 |

### 4. ChartService 테스트

| 테스트 ID | 기능 명세 | 테스트 시나리오 (Given-When-Then) |
| :--- | :--- | :--- |
| **4.1.1** | **다중 통화 차트 데이터 생성** | **Given:** 5개 통화(KRW, CNY, USD, JPY, EUR)의 30일간 환율 데이터<br>**When:** `createMultiCurrencyChart()` 호출<br>**Then:** 5개의 데이터셋이 각각 고유한 색상으로 생성됨 |
| **4.1.2** | **차트 색상 매핑** | **Given:** 통화 코드 'KRW'<br>**When:** `getCurrencyColor('KRW')` 호출<br>**Then:** '#007bff' (파란색) 반환 |
| **4.1.3** | **30일 데이터 범위 검증** | **Given:** 과거 환율 데이터 배열<br>**When:** `getLast30DaysData()` 호출<br>**Then:** 정확히 30일간의 데이터만 반환 |
| **4.1.4** | **차트 반응형 설정** | **Given:** 화면 크기 변경 이벤트<br>**When:** `updateChartResponsiveness()` 호출<br>**Then:** 차트 크기가 화면에 맞게 조정됨 |

## 🚀 개발 순서

### 1. Jest 테스트 환경 설정

1. **`package.json` 파일 확인 및 생성**
   - 프로젝트 루트에 `package.json` 파일이 있는지 확인
   - 없다면 `npm init -y` 명령어로 생성

2. **Jest 관련 패키지 설치**
   ```bash
   npm install --save-dev jest babel-jest @babel/core @babel/preset-env
   ```

3. **Babel 설정 파일 생성**
   - 프로젝트 루트에 `babel.config.js` 파일 생성
   - `@babel/preset-env` 설정으로 ES6+ 문법 지원

4. **테스트 스크립트 추가**
   - `package.json`의 `"scripts"` 섹션에 `"test": "jest"` 추가

5. **기본 테스트 폴더 구조 생성**
   - `src/services/` 폴더 생성
   - 첫 번째 테스트 파일 작성

6. **테스트 환경 검증**
   - `npm test` 명령어로 테스트 환경 확인

### 2. TDD 사이클 진행

1. **`TDD_계획서.md` 1.1.1** 테스트부터 순서대로 **Red -> Green -> Refactor** 사이클 진행
2. `ExchangeRateService` 개발 완료 후, **2.1.1** 테스트부터 `ProfitCalculator` 개발 진행
3. `ProfitCalculator` 완료 후, **3.1.1** 테스트부터 `DeveloperModeService` 개발 진행

## 📋 테스트 전략

### 단위 테스트 (Unit Test)
- **데이터 처리 계층**: `getExchangeRate()`가 기본/백업 API 호출, 로컬 캐시 사용, 기본값 반환을 올바르게 수행하는지 테스트
- **비즈니스 로직 계층**: `calculateProfit()`의 정확한 계산 결과 및 유효하지 않은 값에 대한 에러 처리
- **개발자 모드 계층**: `isDeveloperModeEnabled()`의 정확한 감지 및 `logIfDeveloperMode()`의 조건부 출력

### 통합 테스트 (Integration Test)
- 다중 API 백업 시스템이 실제 네트워크 환경 변화에 따라 올바르게 작동하는지 테스트
- 데이터 로딩 상태, 캐시 사용 상태, 오프라인 상태에 따른 UI 변화 및 메시지 표시가 정확한지 테스트
- 환차손 계산기 입력 유효성 검사 및 결과 표시가 UI와 비즈니스 로직 간에 올바르게 연동되는지 테스트

### 사용자 테스트 (User Acceptance Test)
- 실제 사용자가 서비스를 이용하며 기능의 정상 작동 여부, 사용 편의성, 디자인 만족도 등을 평가
- 피드백을 수집하여 개선에 반영

## 🔄 TDD 사이클 예시

### Red 단계 (실패하는 테스트 작성)
```javascript
// ExchangeRateService.test.js
describe('ExchangeRateService', () => {
  test('기본 API 호출이 성공하면 환율 데이터를 반환해야 한다', async () => {
    // Given: API 호출 성공 모킹
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          base: 'USD',
          rates: { KRW: 1342.50 }
        })
      })
    );

    // When: 서비스 호출
    const service = new ExchangeRateService();
    const result = await service.fetchExchangeRates();

    // Then: 예상 결과 확인
    expect(result.base).toBe('USD');
    expect(result.rates.KRW).toBe(1342.50);
  });
});
```

### Green 단계 (테스트를 통과하는 최소한의 구현)
```javascript
// ExchangeRateService.js
export class ExchangeRateService {
  async fetchExchangeRates() {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    return data;
  }
}
```

### Refactor 단계 (코드 개선)
```javascript
// ExchangeRateService.js
export class ExchangeRateService {
  constructor() {
    this.baseUrl = 'https://api.exchangerate-api.com/v4/latest/USD';
  }

  async fetchExchangeRates() {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      return this.normalizeData(data);
    } catch (error) {
      console.error('API 호출 실패:', error);
      return this.getDefaultRates();
    }
  }

  normalizeData(data) {
    return {
      base: data.base || 'USD',
      rates: data.rates || {},
      date: data.date || new Date().toISOString().split('T')[0]
    };
  }

  getDefaultRates() {
    return {
      base: 'USD',
      rates: { KRW: 1342.50, EUR: 0.92, JPY: 148.35, CNY: 7.23 },
      date: new Date().toISOString().split('T')[0],
      isDefault: true
    };
  }
}
```

## 📊 테스트 커버리지 목표

- **라인 커버리지**: 90% 이상
- **브랜치 커버리지**: 85% 이상
- **함수 커버리지**: 100%
- **구문 커버리지**: 90% 이상

## 🎯 성공 기준

1. **모든 테스트 통과**: 작성된 모든 테스트 케이스가 성공적으로 통과
2. **코드 품질**: ESLint 규칙 준수, 코드 리뷰 통과
3. **성능 요구사항**: API 응답 시간 3초 이내, 페이지 로딩 시간 2초 이내
4. **사용자 경험**: 직관적인 UI/UX, 오류 상황에서도 안정적인 동작