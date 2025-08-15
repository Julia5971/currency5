import { ChartService } from './ChartService.js';

export class HistoricalDataService {
  constructor() {
    this.chartService = new ChartService();
    this.baseUrl = 'https://api.exchangerate-api.com/v4/latest/USD';
  }

  async fetchHistoricalData(days = 30) {
    try {
      // 실제 API 호출 (테스트를 위해)
      const response = await fetch(`${this.baseUrl}/historical?days=${days}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.rates || this.generateMockHistoricalData(days);
    } catch (error) {
      console.error('과거 환율 데이터 가져오기 실패:', error);
      return null;
    }
  }

  generateMockHistoricalData(days) {
    const data = {};
    const baseRates = {
      KRW: 1300,
      JPY: 150,
      EUR: 0.85,
      CNY: 7.2
    };

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      data[dateStr] = {
        KRW: baseRates.KRW + (Math.random() - 0.5) * 20,
        JPY: baseRates.JPY + (Math.random() - 0.5) * 5,
        EUR: baseRates.EUR + (Math.random() - 0.5) * 0.05,
        CNY: baseRates.CNY + (Math.random() - 0.5) * 0.3
      };
    }

    return data;
  }

  createCharts(container, historicalData) {
    if (!historicalData || Object.keys(historicalData).length === 0) {
      container.innerHTML = '<p>차트 데이터가 없습니다.</p>';
      return;
    }

    const chartData = this.chartService.prepareChartData(
      this.convertToArrayFormat(historicalData)
    );

    this.chartService.createAllCharts(container, chartData);
  }

  renderTable(container, historicalData) {
    if (!historicalData || Object.keys(historicalData).length === 0) {
      container.innerHTML = '<p>테이블 데이터가 없습니다.</p>';
      return;
    }

    // 테이블이 없으면 생성
    let tbody = container.querySelector('tbody');
    if (!tbody) {
      const table = document.createElement('table');
      table.innerHTML = `
        <thead>
          <tr>
            <th>날짜</th>
            <th>KRW</th>
            <th>JPY</th>
            <th>EUR</th>
            <th>CNY</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;
      container.appendChild(table);
      tbody = table.querySelector('tbody');
    }

    tbody.innerHTML = '';

    const sortedDates = Object.keys(historicalData).sort();

    sortedDates.forEach(date => {
      const row = document.createElement('tr');
      const rates = historicalData[date];

      row.innerHTML = `
        <td>${date}</td>
        <td>${Number(rates.KRW).toFixed(2)}</td>
        <td>${Number(rates.JPY).toFixed(2)}</td>
        <td>${Number(rates.EUR).toFixed(4)}</td>
        <td>${Number(rates.CNY).toFixed(2)}</td>
      `;

      tbody.appendChild(row);
    });
  }

  convertToArrayFormat(historicalData) {
    return Object.entries(historicalData).map(([date, rates]) => ({
      date,
      ...rates
    }));
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
