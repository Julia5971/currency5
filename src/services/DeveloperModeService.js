export class DeveloperModeService {
  constructor(settingsService = null) {
    this.settingsService = settingsService;
  }

  /**
   * 개발자 모드가 켜져있는지 확인합니다.
   * 설정 파일의 enabled 값과 자동 감지를 모두 고려합니다.
   * @returns {boolean} 개발자 모드 활성화 여부
   */
  async isDeveloperModeEnabled() {
    // 설정 파일에서 개발자 모드가 명시적으로 활성화되어 있으면 true
    if (this.settingsService) {
      const isEnabledInSettings = this.settingsService.isDeveloperModeEnabled();
      if (isEnabledInSettings) {
        return true;
      }

      // 자동 감지가 비활성화되어 있으면 설정값만 사용
      const isAutoDetectEnabled = this.settingsService.isAutoDetectEnabled();
      if (!isAutoDetectEnabled) {
        return false;
      }
    }

    // 자동 감지 로직
    return this._detectDeveloperMode();
  }

  /**
   * 개발자 모드를 자동으로 감지합니다.
   * @returns {boolean} 개발자 모드 감지 여부
   */
  _detectDeveloperMode() {
    // Chrome DevTools 감지 (더 정확한 방법)
    const heightDifference = window.outerHeight - window.innerHeight;
    const widthDifference = window.outerWidth - window.innerWidth;
    
    // DevTools가 열려있으면 창 크기 차이가 발생함
    if (heightDifference > 100 || widthDifference > 100) {
      return true;
    }

    // 추가적인 DevTools 감지 방법들
    try {
      // DevTools가 열려있으면 console.log의 toString이 변경됨
      if (console.log.toString().indexOf('native code') === -1) {
        return true;
      }
      
      // DevTools 감지를 위한 트릭
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        return true;
      }
      
    } catch (e) {
      // 에러가 발생하면 DevTools가 열려있을 가능성이 높음
      return true;
    }

    return false;
  }

  /**
   * 개발자 모드가 켜져있을 때만 console.log를 출력합니다.
   * @param {...any} args - 출력할 인자들
   */
  async logIfDeveloperMode(...args) {
    const isEnabled = await this.isDeveloperModeEnabled();
    if (isEnabled) {
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
