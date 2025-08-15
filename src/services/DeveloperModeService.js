export class DeveloperModeService {
  constructor() {
    // 간단한 개발자 모드 서비스
  }

  /**
   * 개발자 모드가 켜져있는지 확인합니다.
   * 브라우저 개발자 도구가 열려있는지 감지합니다.
   * @returns {boolean} 개발자 모드 활성화 여부
   */
  isDeveloperModeEnabled() {
    // Chrome DevTools 감지
    const heightDifference = window.outerHeight - window.innerHeight;
    const widthDifference = window.outerWidth - window.innerWidth;
    
    // DevTools가 열려있으면 창 크기 차이가 발생함
    if (heightDifference > 100 || widthDifference > 100) {
      return true;
    }

    // 추가적인 DevTools 감지 방법들
    try {
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
  logIfDeveloperMode(...args) {
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
