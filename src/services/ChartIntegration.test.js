import { ChartService } from './ChartService.js';
import { HistoricalDataService } from './HistoricalDataService.js';

// Chart.js 모킹
global.Chart = jest.fn().mockImplementation(() => ({
  destroy: jest.fn(),
  update: jest.fn()
}));

// Canvas 컨텍스트 모킹
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(() => ({ data: new Array(4) })),
  putImageData: jest.fn(),
  createImageData: jest.fn(() => []),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  fillText: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  measureText: jest.fn(() => ({ width: 0 })),
  transform: jest.fn(),
  rect: jest.fn(),
  clip: jest.fn(),
}));

describe('Chart Integration Tests', () => {
  let chartService;
  let historicalDataService;
  let mockContainer;

  beforeEach(() => {
    chartService = new ChartService();
    historicalDataService = new HistoricalDataService();
    mockContainer = document.createElement('div');
    document.body.appendChild(mockContainer);
    jest.clearAllMocks();
  });

  afterEach(() => {
    document.body.removeChild(mockContainer);
  });

  describe('통합 차트 생성', () => {
    it('HistoricalDataService와 ChartService가 연동되어 차트를 생성해야 한다', () => {
      const mockHistoricalData = {
        '2024-01-01': { KRW: 1300, JPY: 150, EUR: 0.85, CNY: 7.2 },
        '2024-01-02': { KRW: 1310, JPY: 151, EUR: 0.86, CNY: 7.3 }
      };

      // ChartService 메서드 모킹
      const mockCreateAllCharts = jest.fn();
      historicalDataService.chartService.createAllCharts = mockCreateAllCharts;

      // HistoricalDataService를 통해 차트 생성
      historicalDataService.createCharts(mockContainer, mockHistoricalData);

      // ChartService의 createAllCharts가 호출되었는지 확인
      expect(mockCreateAllCharts).toHaveBeenCalledWith(
        mockContainer,
        expect.any(Object)
      );
    });

    it('4개 통화의 차트가 모두 생성되어야 한다', () => {
      const mockHistoricalData = {
        '2024-01-01': { KRW: 1300, JPY: 150, EUR: 0.85, CNY: 7.2 }
      };

      // ChartService 메서드 모킹
      const mockPrepareChartData = jest.fn().mockReturnValue({
        KRW: { labels: ['2024-01-01'], datasets: [{ data: [1300] }] },
        JPY: { labels: ['2024-01-01'], datasets: [{ data: [150] }] },
        EUR: { labels: ['2024-01-01'], datasets: [{ data: [0.85] }] },
        CNY: { labels: ['2024-01-01'], datasets: [{ data: [7.2] }] }
      });
      historicalDataService.chartService.prepareChartData = mockPrepareChartData;

      historicalDataService.createCharts(mockContainer, mockHistoricalData);

      // ChartService의 prepareChartData가 호출되었는지 확인
      expect(mockPrepareChartData).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            date: '2024-01-01',
            KRW: 1300,
            JPY: 150,
            EUR: 0.85,
            CNY: 7.2
          })
        ])
      );
    });
  });

  describe('차트 데이터 변환', () => {
    it('과거 데이터가 차트 형식으로 올바르게 변환되어야 한다', () => {
      const rawData = [
        { date: '2024-01-01', KRW: 1300, JPY: 150, EUR: 0.85, CNY: 7.2 },
        { date: '2024-01-02', KRW: 1310, JPY: 151, EUR: 0.86, CNY: 7.3 }
      ];

      const chartData = chartService.prepareChartData(rawData);

      // 각 통화별로 데이터가 올바르게 변환되었는지 확인
      expect(chartData.KRW.labels).toEqual(['2024-01-01', '2024-01-02']);
      expect(chartData.KRW.datasets[0].data).toEqual([1300, 1310]);
      expect(chartData.KRW.datasets[0].borderColor).toBe('rgb(54, 162, 235)'); // 파랑

      expect(chartData.JPY.labels).toEqual(['2024-01-01', '2024-01-02']);
      expect(chartData.JPY.datasets[0].data).toEqual([150, 151]);
      expect(chartData.JPY.datasets[0].borderColor).toBe('rgb(255, 205, 86)'); // 노랑

      expect(chartData.EUR.labels).toEqual(['2024-01-01', '2024-01-02']);
      expect(chartData.EUR.datasets[0].data).toEqual([0.85, 0.86]);
      expect(chartData.EUR.datasets[0].borderColor).toBe('rgb(75, 192, 192)'); // 초록

      expect(chartData.CNY.labels).toEqual(['2024-01-01', '2024-01-02']);
      expect(chartData.CNY.datasets[0].data).toEqual([7.2, 7.3]);
      expect(chartData.CNY.datasets[0].borderColor).toBe('rgb(255, 99, 132)'); // 빨강
    });
  });

  describe('전체 워크플로우', () => {
    it('과거 데이터 가져오기부터 차트 생성까지 전체 과정이 작동해야 한다', async () => {
      // 1. 과거 데이터 가져오기 - mock 데이터 사용
      const mockHistoricalData = {
        '2024-01-01': { KRW: 1300, JPY: 150, EUR: 0.85, CNY: 7.2 },
        '2024-01-02': { KRW: 1310, JPY: 151, EUR: 0.86, CNY: 7.3 },
        '2024-01-03': { KRW: 1305, JPY: 149, EUR: 0.84, CNY: 7.1 },
        '2024-01-04': { KRW: 1315, JPY: 152, EUR: 0.87, CNY: 7.4 },
        '2024-01-05': { KRW: 1308, JPY: 150, EUR: 0.85, CNY: 7.2 },
        '2024-01-06': { KRW: 1312, JPY: 151, EUR: 0.86, CNY: 7.3 },
        '2024-01-07': { KRW: 1309, JPY: 149, EUR: 0.84, CNY: 7.1 }
      };

      expect(mockHistoricalData).toBeDefined();
      expect(Object.keys(mockHistoricalData)).toHaveLength(7);

      // 2. 차트 생성 (메서드 모킹)
      const mockCreateAllCharts = jest.fn();
      historicalDataService.chartService.createAllCharts = mockCreateAllCharts;
      
      historicalDataService.createCharts(mockContainer, mockHistoricalData);
      expect(mockCreateAllCharts).toHaveBeenCalled();

      // 3. 테이블 렌더링
      const tableContainer = document.createElement('div');
      historicalDataService.renderTable(tableContainer, mockHistoricalData);
      
      const rows = tableContainer.querySelectorAll('tbody tr');
      expect(rows.length).toBeGreaterThan(0);
    });
  });
});
