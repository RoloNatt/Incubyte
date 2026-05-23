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

export function formatSalary(amount, currency, displayCurrency = 'Original') {
  let displayAmount = amount;
  let displayCurr = currency;

  if (displayCurrency !== 'Original') {
    displayAmount = convertSalary(amount, currency, displayCurrency);
    displayCurr = displayCurrency;
  }

  const symbol = CURRENCY_SYMBOLS[displayCurr] || '';

  if (displayCurr === 'INR') {
    return `${symbol}${formatIndian(Math.round(displayAmount))}`;
  }

  return `${symbol}${Math.round(displayAmount).toLocaleString('en-US')}`;
}

function formatIndian(num) {
  const str = num.toString();
  if (str.length <= 3) return str;

  const lastThree = str.slice(-3);
  const rest = str.slice(0, -3);
  const formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `${formatted},${lastThree}`;
}
