// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import {
  getWeekStart,
  getWeeklyRecap,
  isRecapDue,
  markRecapSeen,
} from './weeklyRecap.js';

// 30 days up to Wednesday 2024-03-13. The last week is Mon 4 - Sun 10 March,
// the one before is Mon 26 Feb - Sun 3 March.
const DATES = Array.from({ length: 30 }, (_, index) =>
  new Date(Date.UTC(2024, 1, 13 + index)).toISOString().slice(0, 10)
);
const makeDays = totals =>
  DATES.map(date => {
    const total = totals[date] ?? 0;
    return { date, total, goalMet: total >= 2000 };
  });

describe('getWeekStart', () => {
  it('finds the Monday of the week', () => {
    expect(getWeekStart('2024-03-13')).toBe('2024-03-11');
    expect(getWeekStart('2024-03-11')).toBe('2024-03-11');
    expect(getWeekStart('2024-03-10')).toBe('2024-03-04');
  });
});

describe('getWeeklyRecap', () => {
  it('sums up the last Monday-Sunday week', () => {
    const recap = getWeeklyRecap({
      days: makeDays({
        '2024-03-04': 2000,
        '2024-03-06': 2600,
        '2024-03-10': 1400,
        // The week before and the current week do not count.
        '2024-03-03': 5000,
        '2024-03-12': 9000,
      }),
    });

    expect(recap).toEqual({
      from: '2024-03-04',
      to: '2024-03-10',
      goalDays: 2,
      total: 6000,
      average: 857,
      bestDay: { date: '2024-03-06', total: 2600, goalMet: true },
      change: 20,
      nextGoalDays: 3,
    });
  });

  it('has no comparison without water the week before', () => {
    const recap = getWeeklyRecap({ days: makeDays({ '2024-03-05': 1000 }) });

    expect(recap.change).toBeNull();
  });

  it('caps the aim at seven days', () => {
    const totals = Object.fromEntries(
      DATES.slice(-10, -3).map(date => [date, 2100])
    );

    expect(getWeeklyRecap({ days: makeDays(totals) })).toMatchObject({
      goalDays: 7,
      nextGoalDays: 7,
    });
  });

  it('returns null without water last week', () => {
    expect(getWeeklyRecap({ days: makeDays({ '2024-03-12': 500 }) })).toBeNull();
  });
});

describe('isRecapDue and markRecapSeen', () => {
  beforeEach(() => localStorage.clear());

  it('shows the recap once per week and email', () => {
    expect(isRecapDue('a@b.c', '2024-03-11')).toBe(true);

    markRecapSeen('a@b.c', '2024-03-11');
    expect(isRecapDue('a@b.c', '2024-03-17')).toBe(false);
    expect(isRecapDue('x@y.z', '2024-03-13')).toBe(true);
    expect(isRecapDue('a@b.c', '2024-03-18')).toBe(true);
  });
});
