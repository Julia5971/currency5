import { ChartService } from './ChartService.js';

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

// Chart.js 모킹
global.Chart = jest.fn().mockImplementation(() => ({
  destroy: jest.fn(),
  update: jest.fn()
}));

describe('ChartService', () => {
  let chartService;
  let mockContainer;

  beforeEach(() => {
    chartService = new ChartService();
    mockContainer = document.createElement('div');
    document.body.appendChild(mockContainer);
    jest.clearAllMocks();
  });

  afterEach(() => {
    document.body.removeChild(mockContainer);
  });

  describe('createChart', () => {
    it('KRW 차트를 파란색으로 생성해야 한다', () => {
      const mockData = {
        labels: ['2024-01-01', '2024-01-02'],
        datasets: [{
          data: [1300, 1310],
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.1)'
        }]
      };

      chartService.createChart(mockContainer, mockData, 'KRW');

      expect(Chart).toHaveBeenCalledWith(
        expect.any(Object), // getContext()가 반환하는 모킹된 컨텍스트
        expect.objectContaining({
          type: 'line',
          data: mockData,
          options: expect.objectContaining({
            responsive: true,
            maintainAspectRatio: false,
            plugins: expect.objectContaining({
              title: expect.objectContaining({
                text: 'KRW/USD 환율 추이'
              })
            })
          })
        })
      );
    });

    it('JPY 차트를 노란색으로 생성해야 한다', () => {
      const mockData = {
        labels: ['2024-01-01', '2024-01-02'],
        datasets: [{
          data: [150, 151],
          borderColor: 'rgb(255, 205, 86)',
          backgroundColor: 'rgba(255, 205, 86, 0.1)'
        }]
      };

      chartService.createChart(mockContainer, mockData, 'JPY');

      expect(Chart).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          type: 'line',
          data: mockData,
          options: expect.objectContaining({
            plugins: expect.objectContaining({
              title: expect.objectContaining({
                text: 'JPY/USD 환율 추이'
              })
            })
          })
        })
      );
    });

    it('EUR 차트를 초록색으로 생성해야 한다', () => {
      const mockData = {
        labels: ['2024-01-01', '2024-01-02'],
        datasets: [{
          data: [0.85, 0.86],
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.1)'
        }]
      };

      chartService.createChart(mockContainer, mockData, 'EUR');

      expect(Chart).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          type: 'line',
          data: mockData,
          options: expect.objectContaining({
            plugins: expect.objectContaining({
              title: expect.objectContaining({
                text: 'EUR/USD 환율 추이'
              })
            })
          })
        })
      );
    });

    it('CNY 차트를 빨간색으로 생성해야 한다', () => {
      const mockData = {
        labels: ['2024-01-01', '2024-01-02'],
        datasets: [{
          data: [7.2, 7.3],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.1)'
        }]
      };

      chartService.createChart(mockContainer, mockData, 'CNY');

      expect(Chart).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          type: 'line',
          data: mockData,
          options: expect.objectContaining({
            plugins: expect.objectContaining({
              title: expect.objectContaining({
                text: 'CNY/USD 환율 추이'
              })
            })
          })
        })
      );
    });

    it('차트 크기가 300px × 300px이어야 한다', () => {
      const mockData = {
        labels: ['2024-01-01'],
        datasets: [{ data: [1300] }]
      };

      chartService.createChart(mockContainer, mockData, 'KRW');

      const canvas = mockContainer.querySelector('canvas');
      expect(canvas).toBeTruthy();
      expect(canvas.style.width).toBe('300px');
      expect(canvas.style.height).toBe('300px');
    });
  });

  describe('createAllCharts', () => {
    it('4개 통화의 차트를 모두 생성해야 한다', () => {
      const mockHistoricalData = {
        KRW: { labels: ['2024-01-01'], datasets: [{ data: [1300] }] },
        JPY: { labels: ['2024-01-01'], datasets: [{ data: [150] }] },
        EUR: { labels: ['2024-01-01'], datasets: [{ data: [0.85] }] },
        CNY: { labels: ['2024-01-01'], datasets: [{ data: [7.2] }] }
      };

      chartService.createAllCharts(mockContainer, mockHistoricalData);

      expect(Chart).toHaveBeenCalledTimes(4);
    });

    it('2×2 그리드 레이아웃으로 차트를 배치해야 한다', () => {
      const mockHistoricalData = {
        KRW: { labels: ['2024-01-01'], datasets: [{ data: [1300] }] },
        JPY: { labels: ['2024-01-01'], datasets: [{ data: [150] }] },
        EUR: { labels: ['2024-01-01'], datasets: [{ data: [0.85] }] },
        CNY: { labels: ['2024-01-01'], datasets: [{ data: [7.2] }] }
      };

      chartService.createAllCharts(mockContainer, mockHistoricalData);

      const chartContainers = mockContainer.querySelectorAll('.chart-container');
      expect(chartContainers).toHaveLength(4);
      
      // CSS Grid 스타일 확인
      const gridContainer = mockContainer.querySelector('.charts-grid');
      expect(gridContainer).toBeTruthy();
      expect(gridContainer.style.display).toBe('grid');
      expect(gridContainer.style.gridTemplateColumns).toBe('repeat(2, 1fr)');
    });
  });

  describe('prepareChartData', () => {
    it('과거 환율 데이터를 차트 형식으로 변환해야 한다', () => {
      const rawData = [
        { date: '2024-01-01', KRW: 1300, JPY: 150, EUR: 0.85, CNY: 7.2 },
        { date: '2024-01-02', KRW: 1310, JPY: 151, EUR: 0.86, CNY: 7.3 }
      ];

      const chartData = chartService.prepareChartData(rawData);

      expect(chartData.KRW.labels).toEqual(['2024-01-01', '2024-01-02']);
      expect(chartData.KRW.datasets[0].data).toEqual([1300, 1310]);
      expect(chartData.JPY.labels).toEqual(['2024-01-01', '2024-01-02']);
      expect(chartData.JPY.datasets[0].data).toEqual([150, 151]);
    });

    it('x축은 날짜, y축은 원화대비 환율이어야 한다', () => {
      const rawData = [
        { date: '2024-01-01', KRW: 1300, JPY: 150, EUR: 0.85, CNY: 7.2 }
      ];

      const chartData = chartService.prepareChartData(rawData);

      expect(chartData.KRW.labels[0]).toBe('2024-01-01');
      expect(chartData.KRW.datasets[0].data[0]).toBe(1300);
      expect(chartData.KRW.datasets[0].label).toBe('KRW/USD');
    });

    it('각 통화별로 올바른 색상을 적용해야 한다', () => {
      const rawData = [
        { date: '2024-01-01', KRW: 1300, JPY: 150, EUR: 0.85, CNY: 7.2 }
      ];

      const chartData = chartService.prepareChartData(rawData);

      // KRW: 파랑
      expect(chartData.KRW.datasets[0].borderColor).toBe('rgb(54, 162, 235)');
      expect(chartData.KRW.datasets[0].backgroundColor).toBe('rgba(54, 162, 235, 0.1)');
      
      // JPY: 노랑
      expect(chartData.JPY.datasets[0].borderColor).toBe('rgb(255, 205, 86)');
      expect(chartData.JPY.datasets[0].backgroundColor).toBe('rgba(255, 205, 86, 0.1)');
      
      // EUR: 초록
      expect(chartData.EUR.datasets[0].borderColor).toBe('rgb(75, 192, 192)');
      expect(chartData.EUR.datasets[0].backgroundColor).toBe('rgba(75, 192, 192, 0.1)');
      
      // CNY: 빨강
      expect(chartData.CNY.datasets[0].borderColor).toBe('rgb(255, 99, 132)');
      expect(chartData.CNY.datasets[0].backgroundColor).toBe('rgba(255, 99, 132, 0.1)');
    });
  });
});
