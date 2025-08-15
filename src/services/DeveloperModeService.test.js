import { DeveloperModeService } from './DeveloperModeService';
import { SettingsService } from './SettingsService.js';

// console.log 모킹
const mockConsoleLog = jest.fn();
global.console = {
  ...console,
  log: mockConsoleLog
};

// window 객체 모킹
const mockWindow = {
  outerHeight: 800,
  outerWidth: 1200,
  innerHeight: 600,
  innerWidth: 1200,
  navigator: {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
};

global.window = mockWindow;

describe('DeveloperModeService', () => {
  let developerModeService;

  beforeEach(() => {
    // SettingsService 모킹
    const mockSettingsService = {
      isDeveloperModeEnabled: jest.fn().mockReturnValue(false),
      isAutoDetectEnabled: jest.fn().mockReturnValue(true)
    };
    
    developerModeService = new DeveloperModeService(mockSettingsService);
    mockConsoleLog.mockClear();
    
    // 기본 window 설정 (개발자 모드 꺼진 상태)
    Object.defineProperty(global, 'window', {
      value: {
        outerHeight: 800,
        outerWidth: 1200,
        innerHeight: 800,
        innerWidth: 1200,
        navigator: {
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      },
      writable: true
    });
  });

  afterEach(() => {
    // 모킹된 함수들 초기화
    if (developerModeService.settingsService) {
      developerModeService.settingsService.isDeveloperModeEnabled.mockClear();
      developerModeService.settingsService.isAutoDetectEnabled.mockClear();
    }
  });

  describe('isDeveloperModeEnabled', () => {
    test('개발자 모드가 켜져있으면 true를 반환해야 한다', async () => {
      // Given: 개발자 모드가 켜진 상태 (DevTools가 열린 상태)
      Object.defineProperty(global, 'window', {
        value: {
          outerHeight: 800,
          outerWidth: 1200,
          innerHeight: 500, // DevTools가 열려서 innerHeight가 작아짐
          innerWidth: 1200,
          navigator: {
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        },
        writable: true
      });

      // When: 개발자 모드 확인
      const result = await developerModeService.isDeveloperModeEnabled();

      // Then: true 반환
      expect(result).toBe(true);
    });

    test('개발자 모드가 꺼져있으면 false를 반환해야 한다', async () => {
      // Given: 개발자 모드가 꺼진 상태 (DevTools가 닫힌 상태)
      Object.defineProperty(global, 'window', {
        value: {
          outerHeight: 800,
          outerWidth: 1200,
          innerHeight: 800, // DevTools가 닫혀서 innerHeight가 outerHeight와 같음
          innerWidth: 1200,
          navigator: {
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        },
        writable: true
      });

      // SettingsService 모킹 재설정 - 자동 감지 비활성화
      developerModeService.settingsService.isDeveloperModeEnabled.mockReturnValue(false);
      developerModeService.settingsService.isAutoDetectEnabled.mockReturnValue(false);

      // When: 개발자 모드 확인
      const result = await developerModeService.isDeveloperModeEnabled();

      // Then: false 반환
      expect(result).toBe(false);
    });
  });

  describe('logIfDeveloperMode', () => {
    test('개발자 모드가 켜져있으면 console.log를 출력해야 한다', async () => {
      // Given: 개발자 모드가 켜진 상태 (DevTools가 열린 상태)
      Object.defineProperty(global, 'window', {
        value: {
          outerHeight: 800,
          outerWidth: 1200,
          innerHeight: 500, // DevTools가 열려서 innerHeight가 작아짐
          innerWidth: 1200,
          navigator: {
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        },
        writable: true
      });

      // When: 로그 출력 시도
      await developerModeService.logIfDeveloperMode('테스트 메시지');

      // Then: console.log가 호출됨
      expect(mockConsoleLog).toHaveBeenCalledWith('테스트 메시지');
    });

    test('개발자 모드가 꺼져있으면 console.log를 출력하지 않아야 한다', async () => {
      // Given: 개발자 모드가 꺼진 상태 (DevTools가 닫힌 상태)
      Object.defineProperty(global, 'window', {
        value: {
          outerHeight: 800,
          outerWidth: 1200,
          innerHeight: 800, // DevTools가 닫혀서 innerHeight가 outerHeight와 같음
          innerWidth: 1200,
          navigator: {
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        },
        writable: true
      });

      // SettingsService 모킹 재설정 - 자동 감지 비활성화
      developerModeService.settingsService.isDeveloperModeEnabled.mockReturnValue(false);
      developerModeService.settingsService.isAutoDetectEnabled.mockReturnValue(false);

      // When: 로그 출력 시도
      await developerModeService.logIfDeveloperMode('테스트 메시지');

      // Then: console.log가 호출되지 않음
      expect(mockConsoleLog).not.toHaveBeenCalled();
    });

    test('여러 인자를 받아서 console.log에 전달해야 한다', async () => {
      // Given: 개발자 모드가 켜진 상태 (DevTools가 열린 상태)
      Object.defineProperty(global, 'window', {
        value: {
          outerHeight: 800,
          outerWidth: 1200,
          innerHeight: 500, // DevTools가 열려서 innerHeight가 작아짐
          innerWidth: 1200,
          navigator: {
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        },
        writable: true
      });

      // When: 여러 인자로 로그 출력 시도
      await developerModeService.logIfDeveloperMode('메시지1', '메시지2', { key: 'value' });

      // Then: 모든 인자가 console.log에 전달됨
      expect(mockConsoleLog).toHaveBeenCalledWith('메시지1', '메시지2', { key: 'value' });
    });
  });
});
