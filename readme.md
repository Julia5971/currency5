---



# 실시간 환율 정보 및 분석 웹 서비스 (Currency Exchange Rate Service)



이 프로젝트는 다양한 외부 API를 통해 실시간 환율 정보를 가져오고, 환차손익을 계산하는 기능을 제공하는 웹 서비스의 핵심 로직을 담고 있습니다. 모든 기능은 테스트 주도 개발(TDD) 방법론에 따라 견고하게 구현되었습니다.



## 주요 기능



### 1. 환율 정보 서비스 (`ExchangeRateService`)



`src/services/ExchangeRateService.js`에 구현되어 있으며, 다음과 같은 특징을 가집니다.



-   **다중 API 연동 및 장애 복구 (Failover)**

    -   1순위 API(`ExchangeRate-API`) 호출 실패 시, 자동으로 2순위 API(`CurrencyAPI`)를 호출하여 데이터의 안정성을 보장합니다.



-   **로컬 스토리지 캐싱 (Caching)**

    -   API 호출 성공 시, 결과를 `localStorage`에 24시간 동안 캐시합니다.

    -   모든 API가 실패하더라도, 24시간 이내의 유효한 캐시 데이터가 있다면 이를 사용하여 오프라인 상태에서도 제한적인 서비스 이용이 가능합니다.



-   **데이터 정규화 (Normalization)**

    -   기준 통화가 `EUR` 등 다른 통화인 API 응답을 받아도, 시스템의 기준 통화인 `USD`로 모든 환율을 자동 변환하여 일관된 형식의 데이터를 제공합니다.



### 2. 환차손익 계산기 (`ProfitCalculator`)



`src/calculators/ProfitCalculator.js`에 구현된 순수 함수입니다.



-   **기능**: `calculateProfitLoss(매입가, 현재가, 금액)`

-   **설명**: 매입 시점의 환율, 현재 환율, 그리고 보유 외화 금액을 입력받아 환차익 또는 환차손을 계산하여 반환합니다.

-   **예외 처리**: 유효하지 않은 입력값(숫자가 아닌 값)에 대해서는 `NaN`을 반환하여 안정성을 확보했습니다.



## 테스트



본 프로젝트는 `Jest`를 사용하여 테스트 주도 개발(TDD)로 진행되었습니다. 모든 기능 명세는 테스트 코드로 관리되며, `npm test` 명령어로 언제든지 모든 기능의 정상 동작 여부를 검증할 수 있습니다.



-   **테스트 커버리지**: `ExchangeRateService`, `DataNormalizer`, `ProfitCalculator`의 모든 핵심 로직 및 예외 케이스 포함.

-   **실행 방법**:

    ```bash

    npm install

    npm test

    ```



## 개발 원칙



이 프로젝트는 `rules.md`에 정의된 다음과 같은 핵심 원칙에 따라 개발되었습니다.



1.  **단계별 진행 (Step-by-Step)**

2.  **단계별 테스트 (Test per Step)**

3.  **자동화된 커밋 및 푸시 (Automated Commit & Push)**

4.  **명확한 텍스트 중심의 콘텐츠 작성**

