# 🧪 TDD (테스트 주도 개발) 계획서

이 문서는 '실시간 환율 정보 및 분석 웹 서비스'를 테스트 주도 개발(TDD) 방법론에 따라 개발하기 위한 테스트 케이스와 절차를 정의합니다. 개발은 **Red(실패) -> Green(성공) -> Refactor(개선)** 사이클을 따릅니다.

---

## 🎯 1. 핵심 기능: `ExchangeRateService`

가장 핵심적인 데이터 처리 로직인 `ExchangeRateService`를 우선적으로 테스트하고 개발합니다.

### 1.1. API 연동 및 데이터 처리

| 테스트 ID | 기능 명세 | 테스트 시나리오 (Given-When-Then) |
| :--- | :--- | :--- |
| **1.1.1** | **기본 API 호출** | **Given:** `ExchangeRate-API` 호출이 성공할 것이라 가정 (fetch 모킹)<br>**When:** `fetchExchangeRates()` 메서드 호출<br>**Then:** 반환된 데이터의 `base`가 'USD'이고, `rates.KRW` 값이 숫자인지 확인 |
| **1.1.2** | **주 API 실패 시 백업 전환** | **Given:** `ExchangeRate-API`(1순위) 호출은 실패, `CurrencyAPI`(2순위) 호출은 성공하도록 모킹<br>**When:** `fetchExchangeRates()` 호출<br>**Then:** 최종 반환된 데이터의 `source`가 'CurrencyAPI'인지 확인 |
| **1.1.3** | **모든 API 실패** | **Given:** 모든 API 호출이 실패하도록 모킹<br>**When:** `fetchExchangeRates()` 호출<br>**Then:** `getDefaultRates()`가 제공하는 기본 객체를 반환하는지 확인 |

### 1.2. 로컬 스토리지 백업/복원

| 테스트 ID | 기능 명세 | 테스트 시나리오 (Given-When-Then) |
| :--- | :--- | :--- |
| **1.2.1** | **성공 시 데이터 백업** | **Given:** API 호출이 성공적으로 데이터를 가져옴<br>**When:** `fetchExchangeRates()`가 성공적으로 실행된 후<br>**Then:** `localStorage`에 'exchange-rate-backup' 키로 데이터가 저장되었는지 확인 |
| **1.2.2** | **API 실패 시 데이터 복원** | **Given:** 모든 API 호출이 실패하고, `localStorage`에 유효한(24시간 이내) 백업 데이터가 존재함<br>**When:** `fetchExchangeRates()` 호출<br>**Then:** `localStorage`에서 읽어온 데이터를 반환하는지 확인 |
| **1.2.3** | **만료된 데이터 미사용** | **Given:** 모든 API 호출이 실패하고, `localStorage`의 백업 데이터가 24시간을 초과함<br>**When:** `fetchExchangeRates()` 호출<br>**Then:** 백업 데이터를 사용하지 않고, `getDefaultRates()`의 기본값을 반환하는지 확인 |

### 1.3. 데이터 정규화 (Normalization)

| 테스트 ID | 기능 명세 | 테스트 시나리오 (Given-When-Then) |
| :--- | :--- | :--- |
| **1.3.1** | **EUR 기반 데이터 변환** | **Given:** `Fixer.io`(EUR 기준)의 샘플 응답을 모킹<br>**When:** `normalizeData()` 메서드에 해당 데이터를 전달<br>**Then:** 반환된 데이터의 `base`가 'USD'이고, 모든 환율이 USD 기준으로 재계산되었는지 확인 |

---

## 📊 2. 보조 기능: 환차손 계산기

사용자 입력값을 처리하는 순수 함수(pure function)를 테스트합니다.

| 테스트 ID | 기능 명세 | 테스트 시나리오 (Given-When-Then) |
| :--- | :--- | :--- |
| **2.1.1** | **환차익 계산** | **Given:** 매입가 1300, 현재가 1350, 금액 100<br>**When:** `calculateProfitLoss(1300, 1350, 100)` 호출<br>**Then:** `5000`을 반환 |
| **2.1.2** | **환차손 계산** | **Given:** 매입가 1350, 현재가 1300, 금액 100<br>**When:** `calculateProfitLoss(1350, 1300, 100)` 호출<br>**Then:** `-5000`을 반환 |
| **2.1.3** | **유효하지 않은 입력 처리** | **Given:** 매입가에 숫자가 아닌 'abc' 입력<br>**When:** `calculateProfitLoss('abc', 1300, 100)` 호출<br>**Then:** 에러를 발생시키거나 `NaN`을 반환 |

---

## 🚀 3. 개발 순서

1. **Jest 테스트 환경 설정**
2. **`TDD_계획서.md` 1.1.1** 테스트부터 순서대로 **Red -> Green -> Refactor** 사이클 진행
3. `ExchangeRateService` 개발 완료 후, **2.1.1** 테스트부터 `환차손 계산기` 개발 진행
