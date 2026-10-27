import { describe, expect, it } from 'vitest';
import {
  countHydration,
  getCountedMl,
  getDrinkType,
  sumCountedMl,
} from './drinks.js';

describe('drinks', () => {
  it('counts a drink by its share, like the server', () => {
    expect(countHydration(250)).toBe(250);
    expect(countHydration(250, 'coffee')).toBe(200);
    expect(countHydration(330, 'soda')).toBe(231);
  });

  it('takes the counted ml, or the volume for older entries', () => {
    expect(getCountedMl({ usedWater: 250, hydration: 200 })).toBe(200);
    expect(getCountedMl({ usedWater: 250 })).toBe(250);
    expect(getCountedMl({})).toBe(0);
  });

  it('sums the counted ml', () => {
    expect(
      sumCountedMl([{ usedWater: 250, hydration: 200 }, { usedWater: 300 }])
    ).toBe(500);
  });

  it('treats a missing or unknown type as water', () => {
    expect(getDrinkType({})).toBe('water');
    expect(getDrinkType({ drinkType: 'beer' })).toBe('water');
    expect(getDrinkType({ drinkType: 'tea' })).toBe('tea');
  });
});
