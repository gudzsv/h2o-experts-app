import { describe, expect, it } from 'vitest';
import {
  getEntryDateKey,
  getEntryTime,
  getWeekDays,
  getWeekRange,
  TIME_OPTIONS,
  toDateKey,
  toDrinkingTime,
  toMonthKey,
  toTimeOption,
} from './date.js';

describe('date helpers', () => {
  it('formats keys in local time, not UTC', () => {
    // 00:30 local in Asia/Tokyo is still the previous day in UTC.
    expect(toDateKey(new Date(2026, 5, 15, 0, 30))).toBe('2026-06-15');
    expect(toDateKey(new Date(2026, 5, 15, 23, 50))).toBe('2026-06-15');
    expect(toMonthKey(new Date(2026, 5, 15))).toBe('2026-06');
  });

  it('reads the date key from a drinkingTime string', () => {
    expect(getEntryDateKey({ drinkingTime: '2026-10-27T10:05:00' })).toBe(
      '2026-10-27'
    );
  });

  it('returns the last seven days ending today', () => {
    const days = getWeekDays(new Date(2026, 9, 27));

    expect(days.map(toDateKey)).toEqual([
      '2026-10-21',
      '2026-10-22',
      '2026-10-23',
      '2026-10-24',
      '2026-10-25',
      '2026-10-26',
      '2026-10-27',
    ]);
  });

  it('needs one month when the week stays inside a month', () => {
    expect(getWeekRange(new Date(2026, 9, 27))).toEqual({
      startKey: '2026-10-21',
      endKey: '2026-10-27',
      monthKeys: ['2026-10'],
    });
  });

  it('needs two months when the week crosses a month boundary', () => {
    expect(getWeekRange(new Date(2026, 2, 2))).toEqual({
      startKey: '2026-02-24',
      endKey: '2026-03-02',
      monthKeys: ['2026-02', '2026-03'],
    });
  });

  it('handles a year boundary', () => {
    const range = getWeekRange(new Date(2026, 0, 3));

    expect(range.startKey).toBe('2025-12-28');
    expect(range.monthKeys).toEqual(['2025-12', '2026-01']);
  });

  it('offers a time every five minutes for the whole day', () => {
    expect(TIME_OPTIONS).toHaveLength(288);
    expect(TIME_OPTIONS[0]).toBe('00:00');
    expect(TIME_OPTIONS[1]).toBe('00:05');
    expect(TIME_OPTIONS[287]).toBe('23:55');
  });

  it('rounds the current time down to an option', () => {
    expect(toTimeOption(new Date(2026, 9, 27, 14, 37))).toBe('14:35');
    expect(toTimeOption(new Date(2026, 9, 27, 9, 4))).toBe('09:00');
    expect(toTimeOption(new Date(2026, 9, 27, 23, 59))).toBe('23:55');
    expect(TIME_OPTIONS).toContain(toTimeOption(new Date(2026, 9, 27, 14, 37)));
  });

  it('reads and builds drinking times', () => {
    expect(getEntryTime({ drinkingTime: '2026-10-27T08:05:00' })).toBe('08:05');
    expect(toDrinkingTime('2026-10-27', '08:05')).toBe('2026-10-27T08:05:00');
    // An ISO string for the day is tolerated.
    expect(toDrinkingTime('2026-10-27T00:00:00', '08:05')).toBe(
      '2026-10-27T08:05:00'
    );
  });
});
