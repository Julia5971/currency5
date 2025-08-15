export class DeveloperModeService {
  constructor() {
    this.settings = null;
    this.isInitialized = false;
    this.init();
  }

  /**
   * 초기화 함수
   */
  async init() {
    await this.loadSettings();
    
    // 개발자 모드 상태 즉시 출력
    if (this.isDeveloperModeEnabled()) {
      console.log('🔧 개발자 모드 ON');
    } else {
      console.log('🔧 개발자 모드 OFF');
    }
    
    this.isInitialized = true;
  }

  /**
   * settings.json 파일을 로드합니다.
   */
  async loadSettings() {
    try {
      const response = await fetch('./settings.json');
      this.settings = await response.json();
      console.log('설정 파일 로드 완료:', this.settings);
    } catch (error) {
      console.log('설정 파일 로드 실패, 기본값 사용:', error);
      this.settings = {
        developerMode: {
          enabled: false
        }
      };
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
  async logIfDeveloperMode(...args) {
    // 초기화가 완료될 때까지 기다림
    if (!this.isInitialized) {
      await this.init();
    }
    
    if (this.isDeveloperModeEnabled()) {
      console.log(...args);
    }
  }
}

// 사용 예시:
// const devMode = new DeveloperModeService();
// 
// // 개발자 모드에서만 로그 출력
// devMode.logIfDeveloperMode('디버그 정보:', { user: 'test', action: 'login' });
// 
// // 조건부 로직 실행
// if (devMode.isDeveloperModeEnabled()) {
//   console.log('개발자 모드가 활성화되어 있습니다.');
//   // 추가적인 디버그 정보 표시
// }
