export const EXCHANGE_RATES_TO_INR = {
  INR: 1.0,
  USD: 83.0,
  EUR: 90.0,
  GBP: 105.0,
  SGD: 62.0,
  AUD: 55.0,
};

export const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  SGD: 'S$',
  AUD: 'A$',
};

export const DISPLAY_CURRENCIES = ['Original', 'INR', 'USD', 'EUR', 'GBP', 'SGD', 'AUD'];

export function convertSalary(amount, fromCurrency, toCurrency) {
  if (fromCurrency === toCurrency) return amount;
  const inrAmount = amount * EXCHANGE_RATES_TO_INR[fromCurrency];
  return inrAmount / EXCHANGE_RATES_TO_INR[toCurrency];
}

export function applyPeriod(amount, period = 'annual') {
  if (period === 'monthly') return amount / 12;
  return amount;
}

export function formatSalary(amount, currency, displayCurrency = 'Original', period = 'annual') {
  let displayAmount = applyPeriod(amount, period);
  let displayCurr = currency;

  if (displayCurrency !== 'Original') {
    displayAmount = convertSalary(displayAmount, currency, displayCurrency);
    displayCurr = displayCurrency;
  }

  const symbol = CURRENCY_SYMBOLS[displayCurr] || '';

  if (displayCurr === 'INR') {
    return `${symbol}${formatIndian(Math.round(displayAmount))}`;
  }

  return `${symbol}${Math.round(displayAmount).toLocaleString('en-US')}`;
}

export function formatCompact(amount, currency) {
  const symbol = CURRENCY_SYMBOLS[currency] || '';

  if (currency === 'INR') {
    if (amount >= 10000000) {
      const cr = amount / 10000000;
      return `${symbol}${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(1).replace(/\.0$/, '')}Cr`;
    }
    if (amount >= 100000) {
      const l = amount / 100000;
      return `${symbol}${l % 1 === 0 ? l.toFixed(0) : l.toFixed(1).replace(/\.0$/, '')}L`;
    }
    return `${symbol}${formatIndian(Math.round(amount))}`;
  }

  if (amount >= 1000000) {
    const m = amount / 1000000;
    return `${symbol}${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (amount >= 10000) {
    const k = amount / 1000;
    return `${symbol}${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1).replace(/\.0$/, '')}K`;
  }
  return `${symbol}${Math.round(amount).toLocaleString('en-US')}`;
}

function formatIndian(num) {
  const str = num.toString();
  if (str.length <= 3) return str;

  const lastThree = str.slice(-3);
  const rest = str.slice(0, -3);
  const formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `${formatted},${lastThree}`;
}
