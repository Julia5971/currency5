import developerMode from './DeveloperModeService.js';

export class ChartService {
    constructor() {
        this.charts = {};  // 여러 차트를 관리하는 객체
        this.chartData = null;
    }

    /**
     * 모든 차트 초기화
     * @param {Object} canvasElements - 캔버스 요소들의 객체
     * @returns {boolean} 초기화 성공 여부
     */
    initializeAllCharts(canvasElements) {
        if (typeof Chart === 'undefined') {
            developerMode.logIfDeveloperMode('Chart.js가 로드되지 않았습니다');
            return false;
        }

        developerMode.logIfDeveloperMode('캔버스 요소들:', canvasElements);

        const currencies = ['USD', 'EUR', 'CHF', 'CNY', 'JPY'];
        let successCount = 0;

        currencies.forEach(currency => {
            const canvasId = `${currency.toLowerCase()}-chart`;
            const canvas = canvasElements[canvasId];
            
            developerMode.logIfDeveloperMode(`${currency} 차트 초기화 시도:`, {
                canvasId,
                canvas: canvas ? '존재' : '없음',
                canvasWidth: canvas?.width,
                canvasHeight: canvas?.height
            });
            
            if (canvas && this.initializeChart(canvas, currency)) {
                successCount++;
            }
        });

        developerMode.logIfDeveloperMode(`총 ${successCount}개의 차트 초기화 완료`);
        return successCount > 0;
    }

    /**
     * 단일 차트 초기화
     * @param {HTMLCanvasElement} canvas - 차트를 그릴 캔버스 요소
     * @param {string} currency - 통화 코드
     * @returns {boolean} 초기화 성공 여부
     */
    initializeChart(canvas, currency) {
        if (!canvas) {
            developerMode.logIfDeveloperMode(`${currency} 캔버스 요소가 없습니다`);
            return false;
        }

        // 캔버스 크기 설정
        canvas.width = 400;
        canvas.height = 200;
        
        developerMode.logIfDeveloperMode(`${currency} 캔버스 크기 설정:`, {
            width: canvas.width,
            height: canvas.height
        });

        // 기존 차트가 있으면 파괴
        if (this.charts[currency]) {
            this.charts[currency].destroy();
        }

        // 통화별 색상 정의 (개발계획서 요구사항 반영)
        const currencyColors = {
            USD: '#9966FF', // 보라색
            EUR: '#36A2EB', // 파란색
            CHF: '#FF9F40', // 주황색
            CNY: '#dc3545', // 빨간색 (개발계획서 요구사항)
            JPY: '#FFCE56'  // 노란색
        };

        this.charts[currency] = new Chart(canvas, {
            type: 'line',
            data: {
                labels: [],
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                transitions: {
                    active: {
                        animation: {
                            duration: 0
                        }
                    }
                },
                plugins: {
                    title: {
                        display: false
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
                        },
                        ticks: {
                            maxTicksLimit: 6
                        }
                    },
                    y: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: `${currency}/KRW`
                        },
                        beginAtZero: false,
                        ticks: {
                            callback: function(value, index, values) {
                                return value.toLocaleString();
                            },
                            maxTicksLimit: 4
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.1)',
                            drawBorder: false
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
        
        developerMode.logIfDeveloperMode(`${currency} 차트 초기화 완료`);
        return true;
    }

    /**
     * 모든 차트에 데이터 업데이트
     * @param {Array} historicalData - 과거 환율 데이터 배열
     */
    updateAllCharts(historicalData) {
        if (!historicalData || historicalData.length === 0) {
            developerMode.logIfDeveloperMode('업데이트할 데이터가 없습니다');
            return;
        }

        developerMode.logIfDeveloperMode('모든 차트 데이터 업데이트 시작:', historicalData.length);

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

        const currencies = ['USD', 'EUR', 'CHF', 'CNY', 'JPY'];
        const currencyColors = {
            USD: '#9966FF',
            EUR: '#36A2EB',
            CHF: '#FF9F40',
            CNY: '#dc3545', // 빨간색 (개발계획서 요구사항)
            JPY: '#FFCE56'
        };

        currencies.forEach(currency => {
            if (this.charts[currency]) {
                // 각 통화별 데이터 생성
                const data = sortedData.map(item => {
                    const usdRate = item.rates[currency]; // USD/currency
                    const krwRate = item.rates.KRW; // USD/KRW
                    
                    if (currency === 'USD') {
                        return krwRate ? parseFloat(krwRate.toFixed(2)) : null;
                    } else {
                        return (usdRate && krwRate) ? parseFloat((krwRate / usdRate).toFixed(2)) : null;
                    }
                });

                // 차트 데이터 업데이트
                this.charts[currency].data.labels = labels;
                this.charts[currency].data.datasets = [{
                    label: `${currency}/KRW`,
                    data: data,
                    borderColor: currencyColors[currency],
                    backgroundColor: currencyColors[currency] + '20',
                    borderWidth: 2,
                    fill: false,
                    tension: 0,
                    pointRadius: 2,
                    pointHoverRadius: 4
                }];
                
                this.charts[currency].update('none');
            }
        });

        developerMode.logIfDeveloperMode('모든 차트 업데이트 완료');
    }

    /**
     * 모든 차트 파괴
     */
    destroyAllCharts() {
        Object.keys(this.charts).forEach(currency => {
            if (this.charts[currency]) {
                this.charts[currency].destroy();
            }
        });
        this.charts = {};
        developerMode.logIfDeveloperMode('모든 차트 파괴 완료');
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
            
            // 실제 환율과 유사한 변동을 시뮬레이션 (USD 기준)
            const baseUSDKRW = 1350 + Math.sin(i * 0.2) * 50;
            const baseUSDEUR = 0.85 + Math.sin(i * 0.15) * 0.05;
            const baseUSDJPY = 150 + Math.sin(i * 0.25) * 10;
            const baseUSDCNY = 7.2 + Math.sin(i * 0.18) * 0.3;
            const baseUSDCHF = 0.88 + Math.sin(i * 0.12) * 0.03;
            
            sampleData.push({
                date: date.toISOString().split('T')[0],
                rates: {
                    KRW: baseUSDKRW + (Math.random() - 0.5) * 20,
                    EUR: baseUSDEUR + (Math.random() - 0.5) * 0.02,
                    JPY: baseUSDJPY + (Math.random() - 0.5) * 5,
                    CNY: baseUSDCNY + (Math.random() - 0.5) * 0.1,
                    CHF: baseUSDCHF + (Math.random() - 0.5) * 0.02
                }
            });
        }
        
        this.updateAllCharts(sampleData);
        developerMode.logIfDeveloperMode('샘플 데이터 로드 완료', sampleData.length);
        
        return sampleData;
    }
}
