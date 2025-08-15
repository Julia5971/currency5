class DeveloperModeService {
  constructor() {
    this.settings = null;
    this.isInitialized = false;
    
    console.log('🔧 새로운 DeveloperModeService 인스턴스 생성됨');
    
    // 동기적으로 기본 설정 로드
    this.loadDefaultSettings();
    
    // 개발자 모드 상태 즉시 출력 (초기 기본값 기준)
    if (this.isDeveloperModeEnabled()) {
      console.log('🔧 개발자 모드 ON (초기)');
    } else {
      console.log('🔧 개발자 모드 OFF (초기)');
    }
    
    // 비동기적으로 settings.json 로드
    this.loadSettingsFromFile();
  }

  /**
   * 기본 설정을 로드합니다.
   */
  loadDefaultSettings() {
    this.settings = {
      developerMode: {
        enabled: false
      }
    };
    this.isInitialized = true;
  }

  /**
   * settings.json 파일에서 설정을 로드합니다.
   */
  async loadSettingsFromFile() {
    try {
      console.log('🔧 loadSettingsFromFile() 함수 시작');
      console.log('🔧 fetch 호출 시작');
      const response = await fetch('./settings.json?t=' + Date.now()); // 캐시 무효화
      console.log('🔧 fetch 응답 받음:', response.status, response.statusText);
      this.settings = await response.json();
      console.log('🔧 JSON 파싱 완료');
      console.log('설정 파일 로드 완료:', this.settings);
      
      // 디버깅을 위한 상세 로그
      console.log('디버깅 - this.isInitialized:', this.isInitialized);
      console.log('디버깅 - this.settings:', this.settings);
      console.log('디버깅 - this.settings.developerMode:', this.settings?.developerMode);
      console.log('디버깅 - this.settings.developerMode.enabled:', this.settings?.developerMode?.enabled);
      
      // 설정 로드 후 개발자 모드 상태 다시 출력
      const isEnabled = this.isDeveloperModeEnabled();
      console.log('디버깅 - isDeveloperModeEnabled() 결과:', isEnabled);
      
      if (isEnabled) {
        console.log('🔧 개발자 모드 ON (설정 파일에서)');
      } else {
        console.log('🔧 개발자 모드 OFF (설정 파일에서)');
      }
    } catch (error) {
      console.log('🔧 설정 파일 로드 실패:', error);
      console.log('🔧 에러 상세 정보:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
  }

  /**
   * 개발자 모드가 켜져있는지 확인합니다.
   * settings.json 설정만 확인합니다.
   * @returns {boolean} 개발자 모드 활성화 여부
   */
  isDeveloperModeEnabled() {
    // 초기화가 완료되지 않았으면 기본값 반환
    if (!this.isInitialized) {
      return false;
    }
    
    // settings.json에서 개발자 모드 활성화 확인
    if (this.settings && this.settings.developerMode && this.settings.developerMode.enabled) {
      return true;
    }
    return false;
  }

  /**
   * 개발자 모드가 켜져있을 때만 console.log를 출력합니다.
   * @param {...any} args - 출력할 인자들
   */
  logIfDeveloperMode(...args) {
    if (this.isDeveloperModeEnabled()) {
      console.log(...args);
    }
  }
}

// 싱글톤 인스턴스를 생성하고 export
const developerMode = new DeveloperModeService();
export { developerMode };
