class DeveloperModeService {
  constructor() {
    this.settings = null;
    // 서비스 초기화 로직을 실행하고, 완료될 때까지 기다릴 수 있는 Promise를 저장합니다.
    this._readyPromise = this.initialize().then(() => {
      // 초기화 완료 후 최종적으로 결정된 개발자 모드 상태를 출력합니다.
      console.log(`🔧 개발자 모드 상태: ${this.isDeveloperModeEnabled()}`);
    });
  }

  /**
   * 서비스가 준비(설정 파일 로드)될 때까지 기다리는 Promise를 반환합니다.
   * @returns {Promise<void>}
   */
  ready() {
    return this._readyPromise;
  }

  /**
   * 서비스 설정을 비동기적으로 초기화합니다.
   * settings.json 파일을 로드하거나, 실패 시 기본값을 설정합니다.
   */
  async initialize() {
    try {
      const response = await fetch('./settings.json?t=' + Date.now()); // 캐시 방지
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.settings = await response.json();
    } catch (error) {
      console.warn('🔧 설정 파일 로드 실패, 기본 설정 사용:', error);
      // 실패 시 기본 설정을 사용합니다.
      this.settings = {
        developerMode: {
          enabled: false
        }
      };
    }
  }

  /**
   * 개발자 모드가 켜져있는지 확인합니다.
   * @returns {boolean} 개발자 모드 활성화 여부
   */
  isDeveloperModeEnabled() {
    // settings 객체가 존재하고, developerMode.enabled가 true인지 확인합니다.
    return this.settings?.developerMode?.enabled === true;
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
export default developerMode;
