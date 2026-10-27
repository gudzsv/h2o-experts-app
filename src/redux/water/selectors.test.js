import { describe, expect, it } from 'vitest';
import { selectLastWaterEntry } from './selectors.js';

const entry = (id, drinkingTime, usedWater = 100) => ({
  _id: id,
  drinkingTime,
  usedWater,
});

const stateWith = weekWater => ({ water: { weekWater } });

describe('selectLastWaterEntry', () => {
  it('returns null when nothing was drunk in the last week', () => {
    expect(selectLastWaterEntry(stateWith([]))).toBeNull();
  });

  it('picks the entry with the latest drinking time, not the last in the list', () => {
    const state = stateWith([
      entry('b', '2026-10-27T08:00:00'),
      entry('latest', '2026-10-27T21:15:00'),
      entry('a', '2026-10-26T23:59:00'),
    ]);

    expect(selectLastWaterEntry(state)._id).toBe('latest');
  });
});
