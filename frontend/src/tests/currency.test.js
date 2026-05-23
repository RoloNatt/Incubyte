import { describe, it, expect } from 'vitest';
import { convertSalary, formatSalary, applyPeriod, formatCompact } from '../utils/currency';

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

describe('Salary Period', () => {
  it('applyPeriod returns same for annual', () => {
    expect(applyPeriod(120000, 'annual')).toBe(120000);
  });

  it('applyPeriod divides by 12 for monthly', () => {
    expect(applyPeriod(120000, 'monthly')).toBe(10000);
  });

  it('formatSalary respects period monthly', () => {
    const result = formatSalary(120000, 'USD', 'Original', 'monthly');
    expect(result).toBe('$10,000');
  });

  it('formatSalary respects period annual (default)', () => {
    const result = formatSalary(120000, 'USD', 'Original', 'annual');
    expect(result).toBe('$120,000');
  });
});

describe('Compact Formatting', () => {
  it('formats INR in lakhs/crores', () => {
    expect(formatCompact(2400000, 'INR')).toBe('₹24L');
  });

  it('formats INR crores', () => {
    expect(formatCompact(150000000, 'INR')).toBe('₹15Cr');
  });

  it('formats USD in thousands', () => {
    expect(formatCompact(150000, 'USD')).toBe('$150K');
  });

  it('formats USD in millions', () => {
    expect(formatCompact(2500000, 'USD')).toBe('$2.5M');
  });

  it('formats small amounts normally', () => {
    expect(formatCompact(5000, 'USD')).toBe('$5,000');
  });
});
