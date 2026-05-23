import { describe, it, expect } from 'vitest';
import { convertSalary, formatSalary } from '../utils/currency';

describe('Currency Utility', () => {
  it('returns same amount for same currency', () => {
    expect(convertSalary(100000, 'INR', 'INR')).toBe(100000);
  });

  it('converts INR to USD', () => {
    const result = convertSalary(83000, 'INR', 'USD');
    expect(result).toBeCloseTo(1000, 0);
  });

  it('converts USD to INR', () => {
    const result = convertSalary(1000, 'USD', 'INR');
    expect(result).toBeCloseTo(83000, 0);
  });

  it('formats INR with Indian number format', () => {
    const result = formatSalary(1679573, 'INR', 'Original');
    expect(result).toBe('₹16,79,573');
  });

  it('formats USD with western format', () => {
    const result = formatSalary(120000, 'USD', 'Original');
    expect(result).toBe('$120,000');
  });

  it('converts and formats when display currency differs', () => {
    const result = formatSalary(83000, 'INR', 'USD');
    expect(result).toBe('$1,000');
  });

  it('formats EUR correctly', () => {
    const result = formatSalary(90000, 'EUR', 'Original');
    expect(result).toBe('€90,000');
  });

  it('formats GBP correctly', () => {
    const result = formatSalary(75000, 'GBP', 'Original');
    expect(result).toBe('£75,000');
  });
});
