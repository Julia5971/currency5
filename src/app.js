import { fetchExchangeRates } from './services/ExchangeRateService.js';
import { calculateProfitLoss } from './calculators/ProfitCalculator.js';

const rateList = document.getElementById('rate-list');
const lastUpdated = document.getElementById('last-updated');
const calculatorForm = document.getElementById('calculator-form');
const purchasePriceInput = document.getElementById('purchase-price');
const amountInput = document.getElementById('amount');
const calculationResult = document.getElementById('calculation-result');

let currentRates = null;

const updateUI = (data) => {
    const { rates, time_last_update_utc } = data;
    const targetCurrencies = ['KRW', 'EUR', 'JPY', 'CNY'];

    // rate-list 업데이트
    rateList.innerHTML = targetCurrencies.map(currency => `
        <li>${currency} (${getCurrencyName(currency)}): <span>${rates[currency].toFixed(2)}</span></li>
    `).join('');

    // 최종 업데이트 시간 표시
    lastUpdated.textContent = `최종 업데이트: ${new Date(time_last_update_utc).toLocaleString()}`;
};

const getCurrencyName = (currencyCode) => {
    const names = {
        KRW: '대한민국 원',
        EUR: '유로',
        JPY: '일본 엔',
        CNY: '중국 위안',
    };
    return names[currencyCode] || currencyCode;
}

const handleCalculation = (event) => {
    event.preventDefault();

    if (!currentRates) {
        alert('환율 정보가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
        return;
    }

    const purchasePrice = parseFloat(purchasePriceInput.value);
    const amount = parseFloat(amountInput.value);
    const currentPrice = currentRates.KRW;

    if (isNaN(purchasePrice) || isNaN(amount)) {
        calculationResult.textContent = '결과: 유효한 숫자를 입력해주세요.';
        return;
    }

    const profit = calculateProfitLoss(purchasePrice, currentPrice, amount);

    calculationResult.textContent = `결과: ${profit.toFixed(2)} KRW ${profit >= 0 ? '이익' : '손실'}`;
};

const init = async () => {
    const data = await fetchExchangeRates();
    if (data) {
        currentRates = data.rates; // 현재 환율 정보 저장
        updateUI(data);
    }
};

document.addEventListener('DOMContentLoaded', init);
calculatorForm.addEventListener('submit', handleCalculation);
