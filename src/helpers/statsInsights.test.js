import { describe, expect, it } from 'vitest';
import { getStreakStatus, getWeekChange } from './statsInsights.js';

const days = totals => totals.map((total, index) => ({ date: `d${index}`, total }));

const stats = overrides => ({
  days: days([500]),
  currentStreak: 0,
  bestStreak: 0,
  dailyRequirement: 2000,
  ...overrides,
});

describe('getStreakStatus', () => {
  it('tells how much is left today', () => {
    expect(getStreakStatus(stats())).toMatchObject({
      isTodayMet: false,
      remainingMl: 1500,
    });
  });

  it('never shows a negative remainder once the goal is met', () => {
    expect(getStreakStatus(stats({ days: days([2600]) }))).toMatchObject({
      isTodayMet: true,
      remainingMl: 0,
    });
  });

  it('counts the days left to the record', () => {
    const status = getStreakStatus(stats({ currentStreak: 4, bestStreak: 7 }));

    expect(status).toMatchObject({ isRecord: false, daysToRecord: 3 });
  });

  it('marks the current streak as a record when it matches the best one', () => {
    const status = getStreakStatus(stats({ currentStreak: 7, bestStreak: 7 }));

    expect(status).toMatchObject({ isRecord: true, daysToRecord: 0 });
  });

  it('has no record without a streak', () => {
    expect(getStreakStatus(stats()).isRecord).toBe(false);
  });

  it('treats an empty history as nothing drunk today', () => {
    expect(getStreakStatus(stats({ days: [] })).remainingMl).toBe(2000);
  });
});

describe('getWeekChange', () => {
  const twoWeeks = (previous, current) =>
    ({ days: days([...Array(16).fill(0), ...Array(7).fill(previous), ...Array(7).fill(current)]) });

  it('compares the last 7 days with the 7 days before', () => {
    expect(getWeekChange(twoWeeks(1000, 1120))).toBe(12);
    expect(getWeekChange(twoWeeks(2000, 1500))).toBe(-25);
    expect(getWeekChange(twoWeeks(1500, 1500))).toBe(0);
  });

  it('gives no comparison when the earlier week is empty', () => {
    expect(getWeekChange(twoWeeks(0, 1500))).toBeNull();
  });

  it('gives no comparison with less than two weeks of days', () => {
    expect(getWeekChange({ days: days([1000, 1000]) })).toBeNull();
  });
});
