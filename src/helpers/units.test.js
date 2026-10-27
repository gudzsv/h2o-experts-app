import { describe, expect, it } from 'vitest';
import {
  formatDailyNorm,
  formatVolume,
  fromDisplayAmount,
  getDefaultAmount,
  getMaxAmount,
  getQuickAmounts,
  getStep,
  normalizeUnits,
  toDisplayAmount,
  toDisplayDecimal,
} from './units.js';

const labels = { ml: 'ml', l: 'L', oz: 'oz' };

describe('units', () => {
  it('treats anything but oz as milliliters', () => {
    expect(normalizeUnits('oz')).toBe('oz');
    expect(normalizeUnits('ml')).toBe('ml');
    expect(normalizeUnits(undefined)).toBe('ml');
    expect(normalizeUnits('gal')).toBe('ml');
  });

  it('keeps milliliters untouched', () => {
    expect(toDisplayAmount(250, 'ml')).toBe(250);
    expect(fromDisplayAmount(250, 'ml')).toBe(250);
  });

  it('converts whole ounces to milliliters and back without drifting', () => {
    expect(fromDisplayAmount(8, 'oz')).toBe(237);
    expect(fromDisplayAmount(70, 'oz')).toBe(2070);

    for (let oz = 1; oz <= 338; oz++) {
      expect(toDisplayAmount(fromDisplayAmount(oz, 'oz'), 'oz')).toBe(oz);
    }
  });

  it('shows one decimal of an ounce value on the chart', () => {
    expect(toDisplayDecimal(500, 'oz')).toBe(16.9);
    expect(toDisplayDecimal(500, 'ml')).toBe(500);
  });

  it('formats an entry in the chosen units', () => {
    expect(formatVolume(250, 'ml', labels)).toBe('250 ml');
    expect(formatVolume(999, 'ml', labels)).toBe('999 ml');
    expect(formatVolume(1500, 'ml', labels)).toBe('1.5 L');
    expect(formatVolume(250, 'oz', labels)).toBe('8.5 oz');
    expect(formatVolume(500, 'oz', labels)).toBe('16.9 oz');
  });

  it('formats the daily norm in the chosen units', () => {
    expect(formatDailyNorm(2000, 'ml', labels)).toBe('2 L');
    expect(formatDailyNorm(1500, 'ml', labels)).toBe('1.5 L');
    expect(formatDailyNorm(2000, 'oz', labels)).toBe('68 oz');
  });

  it('has sensible form limits for both units', () => {
    expect(getStep('ml')).toBe(50);
    expect(getStep('oz')).toBe(1);
    expect(getDefaultAmount('ml')).toBe(50);
    expect(getDefaultAmount('oz')).toBe(2);
    expect(getMaxAmount('ml')).toBe(9999);
    expect(getMaxAmount('oz')).toBe(338);
    // The largest ounce value must still fit the 9999 ml limit.
    expect(fromDisplayAmount(getMaxAmount('oz'), 'oz')).toBeLessThanOrEqual(
      9999
    );
  });

  it('offers quick amounts written in the chosen units', () => {
    expect(getQuickAmounts('ml')).toEqual([150, 250, 330, 500]);
    expect(getQuickAmounts('oz')).toEqual([4, 8, 12, 16]);
  });
});
