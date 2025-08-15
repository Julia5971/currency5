import { HistoricalDataService } from './HistoricalDataService.js';

// fetch 모킹
global.fetch = jest.fn();

describe('HistoricalDataService', () => {
  let historicalDataService;

  beforeEach(() => {
    historicalDataService = new HistoricalDataService();
    fetch.mockClear();
  });

  describe('fetchHistoricalData', () => {
    it('지정된 일수만큼 과거 환율 데이터를 가져와야 한다', async () => {
      const mockResponse = {
        rates: {
          '2024-01-01': { KRW: 1300, JPY: 150, EUR: 0.85, CNY: 7.2 },
          '2024-01-02': { KRW: 1310, JPY: 151, EUR: 0.86, CNY: 7.3 }
        }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await historicalDataService.fetchHistoricalData(2);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('historical')
      );
      expect(result).toEqual(mockResponse.rates);
    });

    it('API 호출 실패 시 null을 반환해야 한다', async () => {
      fetch.mockRejectedValueOnce(new Error('API Error'));

      const result = await historicalDataService.fetchHistoricalData(7);

      expect(result).toBeNull();
    });

    it('응답이 ok가 아닌 경우 null을 반환해야 한다', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      const result = await historicalDataService.fetchHistoricalData(7);

      expect(result).toBeNull();
    });
  });

  describe('createCharts', () => {
    it('ChartService를 사용하여 차트를 생성해야 한다', () => {
      const mockContainer = document.createElement('div');
      const mockHistoricalData = {
        '2024-01-01': { KRW: 1300, JPY: 150, EUR: 0.85, CNY: 7.2 }
      };

      // ChartService 모킹
      const mockCreateAllCharts = jest.fn();
      historicalDataService.chartService.createAllCharts = mockCreateAllCharts;

      historicalDataService.createCharts(mockContainer, mockHistoricalData);

      expect(mockCreateAllCharts).toHaveBeenCalledWith(
        mockContainer,
        expect.any(Object)
      );
    });
  });

  describe('renderTable', () => {
    it('과거 환율 데이터를 테이블로 렌더링해야 한다', () => {
      const mockContainer = document.createElement('div');
      const mockHistoricalData = {
        '2024-01-01': { KRW: 1300.5, JPY: 150.25, EUR: 0.85, CNY: 7.2 },
        '2024-01-02': { KRW: 1310.75, JPY: 151.5, EUR: 0.86, CNY: 7.3 }
      };

      historicalDataService.renderTable(mockContainer, mockHistoricalData);

      const rows = mockContainer.querySelectorAll('tbody tr');
      expect(rows).toHaveLength(2);

      // 첫 번째 행의 데이터 확인
      const firstRowCells = rows[0].querySelectorAll('td');
      expect(firstRowCells[0].textContent).toBe('2024-01-01');
      expect(firstRowCells[1].textContent).toBe('1300.50');  // toFixed(2) 적용
      expect(firstRowCells[2].textContent).toBe('150.25');   // toFixed(2) 적용
      expect(firstRowCells[3].textContent).toBe('0.8500');   // toFixed(4) 적용
      expect(firstRowCells[4].textContent).toBe('7.20');     // toFixed(2) 적용
    });

    it('빈 데이터일 경우 빈 테이블을 렌더링해야 한다', () => {
      const mockContainer = document.createElement('div');
      const mockHistoricalData = {};

      historicalDataService.renderTable(mockContainer, mockHistoricalData);

      const rows = mockContainer.querySelectorAll('tbody tr');
      expect(rows).toHaveLength(0);
    });
  });

  describe('formatDate', () => {
    it('날짜를 한국어 형식으로 포맷해야 한다', () => {
      const date = '2024-01-01';
      const formatted = historicalDataService.formatDate(date);

      expect(formatted).toMatch(/\d{4}년 \d{1,2}월 \d{1,2}일/);
    });
  });
});
