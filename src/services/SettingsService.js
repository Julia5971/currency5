export class SettingsService {
  constructor() {
    this.settings = null;
    this.loadSettings();
  }

  /**
   * 설정 파일을 로드합니다.
   */
  async loadSettings() {
    try {
      const response = await fetch('./settings.json');
      if (response.ok) {
        this.settings = await response.json();
      } else {
        // 기본 설정 사용
        this.settings = this.getDefaultSettings();
      }
    } catch (error) {
      console.warn('설정 파일 로드 실패, 기본 설정 사용:', error);
      this.settings = this.getDefaultSettings();
    }
  }

  /**
   * 기본 설정을 반환합니다.
   */
  getDefaultSettings() {
    return {
      developerMode: {
        enabled: false,
        autoDetect: true,
        logLevel: "info"
      },
      app: {
        name: "Currency Exchange Rate Service",
        version: "1.0.0"
      }
    };
  }

  /**
   * 설정을 가져옵니다.
   */
  getSettings() {
    return this.settings || this.getDefaultSettings();
  }

  /**
   * 개발자 모드 설정을 가져옵니다.
   */
  getDeveloperModeSettings() {
    const settings = this.getSettings();
    return settings.developerMode || { enabled: false, autoDetect: true, logLevel: "info" };
  }

  /**
   * 개발자 모드가 활성화되어 있는지 확인합니다.
   */
  isDeveloperModeEnabled() {
    const devSettings = this.getDeveloperModeSettings();
    return devSettings.enabled;
  }

  /**
   * 자동 감지가 활성화되어 있는지 확인합니다.
   */
  isAutoDetectEnabled() {
    const devSettings = this.getDeveloperModeSettings();
    return devSettings.autoDetect;
  }

  /**
   * 로그 레벨을 가져옵니다.
   */
  getLogLevel() {
    const devSettings = this.getDeveloperModeSettings();
    return devSettings.logLevel || "info";
  }
}
