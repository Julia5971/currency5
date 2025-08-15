export class ChartService {
  constructor() {
    this.chartColors = {
      KRW: { border: 'rgb(54, 162, 235)', background: 'rgba(54, 162, 235, 0.1)' }, // 파랑
      JPY: { border: 'rgb(255, 205, 86)', background: 'rgba(255, 205, 86, 0.1)' },   // 노랑
      EUR: { border: 'rgb(75, 192, 192)', background: 'rgba(75, 192, 192, 0.1)' },   // 초록
      CNY: { border: 'rgb(255, 99, 132)', background: 'rgba(255, 99, 132, 0.1)' }    // 빨강
    };
  }

  createChart(container, data, currency) {
    const canvas = document.createElement('canvas');
    canvas.style.width = '300px';
    canvas.style.height = '300px';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    
    return new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${currency}/USD 환율 추이`
          },
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: '날짜'
            }
          },
          y: {
            title: {
              display: true,
              text: '환율'
            }
          }
        }
      }
    });
  }

  createAllCharts(container, historicalData) {
    // 기존 차트 제거
    container.innerHTML = '';
    
    // 2×2 그리드 컨테이너 생성
    const gridContainer = document.createElement('div');
    gridContainer.className = 'charts-grid';
    gridContainer.style.display = 'grid';
    gridContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
    gridContainer.style.gap = '20px';
    gridContainer.style.justifyContent = 'center';
    container.appendChild(gridContainer);

    const currencies = ['KRW', 'JPY', 'EUR', 'CNY'];
    
    currencies.forEach(currency => {
      if (historicalData[currency]) {
        const chartContainer = document.createElement('div');
        chartContainer.className = 'chart-container';
        chartContainer.style.width = '300px';
        chartContainer.style.height = '300px';
        
        gridContainer.appendChild(chartContainer);
        
        this.createChart(chartContainer, historicalData[currency], currency);
      }
    });
  }

  prepareChartData(rawData) {
    const currencies = ['KRW', 'JPY', 'EUR', 'CNY'];
    const chartData = {};

    currencies.forEach(currency => {
      chartData[currency] = {
        labels: rawData.map(item => item.date),
        datasets: [{
          label: `${currency}/USD`,
          data: rawData.map(item => item[currency]),
          borderColor: this.chartColors[currency].border,
          backgroundColor: this.chartColors[currency].background,
          borderWidth: 2,
          fill: false,
          tension: 0.1
        }]
      };
    });

    return chartData;
  }
}
