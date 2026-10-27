import { describe, expect, it } from 'vitest';
import { calculateDailyNormLiters } from './dailyNorm.js';

describe('calculateDailyNormLiters', () => {
  it('uses the women formula', () => {
    expect(calculateDailyNormLiters('female', 60, 2)).toBeCloseTo(2.6);
  });

  it('uses the men formula', () => {
    expect(calculateDailyNormLiters('male', 76, 2)).toBeCloseTo(4.24);
  });

  it('accepts the strings typed into the form', () => {
    expect(calculateDailyNormLiters('female', '60', '2')).toBeCloseTo(2.6);
  });

  it('returns null when it cannot be calculated', () => {
    expect(calculateDailyNormLiters(undefined, 60, 2)).toBeNull();
    expect(calculateDailyNormLiters('female', undefined, 2)).toBeNull();
    expect(calculateDailyNormLiters('male', 'abc', 2)).toBeNull();
  });
});
