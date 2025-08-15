import { DeveloperModeService } from './DeveloperModeService.js';

const developerMode = new DeveloperModeService();

export class ChartService {
    constructor() {
        this.chart = null;
        this.chartData = {
            labels: [],
            datasets: []
        };
    }

    /**
     * 차트 초기화
     * @param {HTMLCanvasElement} canvas - 차트를 그릴 캔버스 요소
     */
    initializeChart(canvas) {
        developerMode.logIfDeveloperMode('차트 초기화 시작');
        
        const ctx = canvas.getContext('2d');
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: this.chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: '환율 변동 추이 (최근 30일)',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: '날짜'
                        },
                        ticks: {
                            maxTicksLimit: 10
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: '환율 (KRW)'
                        },
                        beginAtZero: false
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
        
        developerMode.logIfDeveloperMode('차트 초기화 완료');
    }

    /**
     * 환율 데이터로 차트 업데이트
     * @param {Array} historicalData - 과거 환율 데이터 배열
     */
    updateChart(historicalData) {
        if (!this.chart) {
            developerMode.logIfDeveloperMode('차트가 초기화되지 않았습니다');
            return;
        }

        developerMode.logIfDeveloperMode('차트 데이터 업데이트 시작:', historicalData);

        // 데이터 정렬 (날짜순)
        const sortedData = historicalData.sort((a, b) => new Date(a.date) - new Date(b.date));

        // 라벨 (날짜) 설정
        const labels = sortedData.map(item => {
            const date = new Date(item.date);
            return date.toLocaleDateString('ko-KR', { 
                month: 'short', 
                day: 'numeric' 
            });
        });

        // 통화별 색상 정의
        const currencyColors = {
            KRW: '#FF6384', // 빨간색
            EUR: '#36A2EB', // 파란색
            JPY: '#FFCE56', // 노란색
            CNY: '#4BC0C0', // 청록색
            USD: '#9966FF'  // 보라색
        };

        // 데이터셋 생성
        const datasets = [];
        const currencies = ['KRW', 'EUR', 'JPY', 'CNY'];

        currencies.forEach(currency => {
            const data = sortedData.map(item => {
                const rate = item.rates[currency];
                return rate ? parseFloat(rate.toFixed(2)) : null;
            });

            datasets.push({
                label: currency,
                data: data,
                borderColor: currencyColors[currency],
                backgroundColor: currencyColors[currency] + '20',
                borderWidth: 2,
                fill: false,
                tension: 0.1,
                pointRadius: 3,
                pointHoverRadius: 6
            });
        });

        // 차트 데이터 업데이트
        this.chart.data.labels = labels;
        this.chart.data.datasets = datasets;
        this.chart.update();

        developerMode.logIfDeveloperMode('차트 업데이트 완료', {
            labelsCount: labels.length,
            datasetsCount: datasets.length,
            currencies: currencies
        });
    }

    /**
     * 차트 파괴
     */
    destroyChart() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
            developerMode.logIfDeveloperMode('차트 파괴 완료');
        }
    }

    /**
     * 샘플 데이터로 차트 테스트
     */
    loadSampleData() {
        developerMode.logIfDeveloperMode('샘플 데이터 로드 시작');
        
        const sampleData = [];
        const today = new Date();
        
        // 최근 30일간의 샘플 데이터 생성
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            // 실제 환율과 유사한 변동을 시뮬레이션
            const baseKRW = 1350 + Math.sin(i * 0.2) * 50;
            const baseEUR = 0.85 + Math.sin(i * 0.15) * 0.05;
            const baseJPY = 150 + Math.sin(i * 0.25) * 10;
            const baseCNY = 7.2 + Math.sin(i * 0.18) * 0.3;
            
            sampleData.push({
                date: date.toISOString().split('T')[0],
                rates: {
                    KRW: baseKRW + (Math.random() - 0.5) * 20,
                    EUR: baseEUR + (Math.random() - 0.5) * 0.02,
                    JPY: baseJPY + (Math.random() - 0.5) * 5,
                    CNY: baseCNY + (Math.random() - 0.5) * 0.1
                }
            });
        }
        
        this.updateChart(sampleData);
        developerMode.logIfDeveloperMode('샘플 데이터 로드 완료', sampleData.length);
        
        return sampleData;
    }
}
