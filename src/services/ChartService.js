import developerMode from './DeveloperModeService.js';

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
                    if (!canvas) {
                        developerMode.logIfDeveloperMode('캔버스 요소가 없습니다');
                        return false;
                    }
                    
                    if (typeof Chart === 'undefined') {
                        developerMode.logIfDeveloperMode('Chart.js가 로딩되지 않았습니다');
                        return false;
                    }
                    
                    developerMode.logIfDeveloperMode('차트 초기화 시작');
        
        // 캔버스 크기 정보 출력
        const canvasSize = {
            width: canvas.width,
            height: canvas.height,
            offsetWidth: canvas.offsetWidth,
            offsetHeight: canvas.offsetHeight,
            clientWidth: canvas.clientWidth,
            clientHeight: canvas.clientHeight,
            scrollWidth: canvas.scrollWidth,
            scrollHeight: canvas.scrollHeight,
            style: {
                width: canvas.style.width,
                height: canvas.style.height
            }
        };
        
                            developerMode.logIfDeveloperMode('캔버스 크기 정보:', canvasSize);
                    console.log('캔버스 크기 정보:', canvasSize);
                    
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        developerMode.logIfDeveloperMode('캔버스 컨텍스트를 가져올 수 없습니다');
                        return false;
                    }
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: this.chartData,
            options: {
                responsive: false,  // 반응형 비활성화
                maintainAspectRatio: true,  // 비율 유지
                aspectRatio: 3,  // 가로:세로 비율을 더 넓게 설정 (높이 줄임)
                animation: false,  // 애니메이션 비활성화로 성능 향상
                transitions: {
                    active: {
                        animation: {
                            duration: 0
                        }
                    }
                },
                plugins: {
                                                    title: {
                                    display: true,
                                    text: 'KRW 기준 환율 변동 추이 (최근 30일)',
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
                        type: 'linear',
                        title: {
                            display: true,
                            text: 'KRW 기준 환율'
                        },
                        beginAtZero: false,
                        min: 0,
                        max: 2000,
                        ticks: {
                            callback: function(value, index, values) {
                                return value.toLocaleString();
                            },
                            maxTicksLimit: 4,  // 축 눈금 개수 줄임
                            stepSize: 500  // 눈금 간격을 500으로 고정
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.1)',  // 그리드 색상 연하게
                            drawBorder: false  // 테두리 제거
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
        
                            developerMode.logIfDeveloperMode('차트 초기화 완료');
                    return true;
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
        
        // 차트 크기 정보 출력
        const chartSize = {
            canvas: {
                width: this.chart.canvas.width,
                height: this.chart.canvas.height,
                offsetWidth: this.chart.canvas.offsetWidth,
                offsetHeight: this.chart.canvas.offsetHeight
            },
            chart: {
                width: this.chart.width,
                height: this.chart.height
            }
        };
        
                            developerMode.logIfDeveloperMode('차트 크기 정보:', chartSize);
                    console.log('차트 크기 정보:', chartSize);

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
            USD: '#9966FF', // 보라색
            CHF: '#FF9F40'  // 주황색
        };

        // 데이터셋 생성 - KRW 기준 환율로 변환
        const datasets = [];
        // settings.json에서 활성화된 통화 목록 가져오기
        const currencies = ['USD', 'EUR', 'CHF', 'CNY', 'JPY']; // 기본값, 나중에 settings.json에서 읽어올 예정

        currencies.forEach(currency => {
            const data = sortedData.map(item => {
                // USD 기준 환율을 KRW 기준으로 변환
                const usdRate = item.rates[currency]; // USD/currency
                const krwRate = item.rates.KRW; // USD/KRW
                
                if (currency === 'USD') {
                    // USD/KRW는 그대로
                    return krwRate ? parseFloat(krwRate.toFixed(2)) : null;
                } else {
                    // 다른 통화는 USD/KRW ÷ USD/currency = KRW/currency
                    return (usdRate && krwRate) ? parseFloat((krwRate / usdRate).toFixed(2)) : null;
                }
            });

            datasets.push({
                label: `${currency}/KRW`,
                data: data,
                borderColor: currencyColors[currency],
                backgroundColor: currencyColors[currency] + '20',
                borderWidth: 2,
                fill: false,
                tension: 0,  // 곡선 부드러움 제거로 성능 향상
                pointRadius: 2,  // 포인트 크기 축소
                pointHoverRadius: 4
            });
        });

        // 차트 데이터 업데이트 (성능 최적화)
        this.chart.data.labels = labels;
        this.chart.data.datasets = datasets;
        this.chart.update('none'); // 애니메이션 비활성화로 성능 향상

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
        
                            this.updateChart(sampleData);
                    developerMode.logIfDeveloperMode('샘플 데이터 로드 완료', sampleData.length);
                    
                    return sampleData;
    }
}
