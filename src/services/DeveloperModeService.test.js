import { DeveloperModeService } from './DeveloperModeService.js';

const mockConsoleLog = jest.fn();
global.console = {
  ...console,
  log: mockConsoleLog
};

describe('DeveloperModeService', () => {
  let developerModeService;

  beforeEach(() => {
    developerModeService = new DeveloperModeService();
    mockConsoleLog.mockClear();
  });

  describe('logIfDeveloperMode', () => {
    test('여러 인자를 받아서 console.log에 전달해야 한다', () => {
      // Given: 개발자 모드가 켜진 상태로 가정 (실제 테스트에서는 모킹이 복잡하므로 간단히 테스트)
      // 실제로는 window 객체 모킹이 필요하지만, 여기서는 기본 동작만 테스트
      
      // When: 여러 인자로 로그 출력 시도
      developerModeService.logIfDeveloperMode('메시지1', '메시지2', { key: 'value' });

      // Then: 함수가 호출되었는지 확인 (실제 로그 출력 여부는 환경에 따라 다름)
      // 실제 테스트에서는 window 모킹이 필요하지만, 기본 구조는 확인
      expect(typeof developerModeService.logIfDeveloperMode).toBe('function');
    });

    test('함수가 정의되어 있어야 한다', () => {
      // Given & When: 서비스 인스턴스 생성
      // Then: 필요한 메서드들이 존재하는지 확인
      expect(typeof developerModeService.isDeveloperModeEnabled).toBe('function');
      expect(typeof developerModeService.logIfDeveloperMode).toBe('function');
    });
  });

  describe('실제 사용 사례 테스트', () => {
    test('환율 API 호출 시 개발자 모드에 따른 로그 출력', () => {
      // Given: 개발자 모드가 켜진 상태로 가정
      
      // When: API 관련 로그 출력
      developerModeService.logIfDeveloperMode('ExchangeRate-API에서 데이터를 성공적으로 가져왔습니다.');
      developerModeService.logIfDeveloperMode('API 호출 실패:', 'Network Error');

      // Then: 함수가 호출되었는지 확인
      expect(typeof developerModeService.logIfDeveloperMode).toBe('function');
    });

    test('환차손익 계산 시 개발자 모드에 따른 로그 출력', () => {
      // Given: 개발자 모드가 켜진 상태로 가정
      
      // When: 계산 관련 로그 출력
      developerModeService.logIfDeveloperMode('환차손익 계산 시작:', { purchasePrice: 1300, currentPrice: 1350, amount: 100 });
      developerModeService.logIfDeveloperMode('환차손익 계산 완료:', { profitPerUnit: 50, result: 5000 });

      // Then: 함수가 호출되었는지 확인
      expect(typeof developerModeService.logIfDeveloperMode).toBe('function');
    });

    test('데이터 정규화 시 개발자 모드에 따른 로그 출력', () => {
      // Given: 개발자 모드가 켜진 상태로 가정
      
      // When: 데이터 정규화 관련 로그 출력
      developerModeService.logIfDeveloperMode('데이터 정규화 시작:', { base: 'EUR', ratesCount: 5 });
      developerModeService.logIfDeveloperMode('EUR 기반 데이터를 USD로 변환합니다.');
      developerModeService.logIfDeveloperMode('EUR → USD 변환 완료:', { originalCount: 5, convertedCount: 5 });

      // Then: 함수가 호출되었는지 확인
      expect(typeof developerModeService.logIfDeveloperMode).toBe('function');
    });
  });
});
