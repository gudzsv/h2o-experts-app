// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import {
  DEFAULT_REMINDERS,
  getLastDrinkAt,
  isValidWindow,
  readReminders,
  saveReminders,
  shouldRemind,
} from './reminders.js';

const at = time => new Date(`2024-03-10T${time}:00`);
const settings = overrides => ({
  ...DEFAULT_REMINDERS,
  enabled: true,
  ...overrides,
});

describe('shouldRemind', () => {
  it('reminds inside the window when nothing happened yet', () => {
    expect(
      shouldRemind({ settings: settings(), now: at('09:00'), lastDrinkAt: null })
    ).toBe(true);
  });

  it('stays quiet when off, outside the window or with the goal met', () => {
    const now = at('12:00');
    expect(
      shouldRemind({ settings: settings({ enabled: false }), now })
    ).toBe(false);
    expect(shouldRemind({ settings: settings(), now: at('08:59') })).toBe(
      false
    );
    expect(shouldRemind({ settings: settings(), now: at('21:00') })).toBe(
      false
    );
    expect(shouldRemind({ settings: settings(), now, isGoalMet: true })).toBe(
      false
    );
  });

  it('waits the interval after the last drink', () => {
    const lastDrinkAt = at('10:00').getTime();

    expect(
      shouldRemind({ settings: settings(), now: at('11:29'), lastDrinkAt })
    ).toBe(false);
    expect(
      shouldRemind({ settings: settings(), now: at('11:30'), lastDrinkAt })
    ).toBe(true);
  });

  it('waits the interval after the last reminder', () => {
    const lastAt = at('10:00').getTime();

    expect(
      shouldRemind({ settings: settings({ lastAt }), now: at('11:00') })
    ).toBe(false);
    expect(
      shouldRemind({
        settings: settings({ lastAt, interval: 60 }),
        now: at('11:00'),
      })
    ).toBe(true);
  });
});

describe('isValidWindow', () => {
  it('needs the start before the end', () => {
    expect(isValidWindow({ from: '09:00', to: '21:00' })).toBe(true);
    expect(isValidWindow({ from: '21:00', to: '09:00' })).toBe(false);
    expect(isValidWindow({ from: '', to: '09:00' })).toBe(false);
  });
});

describe('getLastDrinkAt', () => {
  it('takes the latest entry or null', () => {
    expect(getLastDrinkAt([])).toBeNull();
    expect(
      getLastDrinkAt([
        { drinkingTime: '2024-03-10T12:30:00' },
        { drinkingTime: '2024-03-10T08:00:00' },
      ])
    ).toBe(at('12:30').getTime());
  });
});

describe('readReminders and saveReminders', () => {
  beforeEach(() => localStorage.clear());

  it('keeps the settings per email', () => {
    expect(readReminders('a@b.c')).toEqual(DEFAULT_REMINDERS);

    saveReminders('a@b.c', { enabled: true, interval: 60 });
    saveReminders('a@b.c', { lastAt: 5 });

    expect(readReminders('a@b.c')).toMatchObject({
      enabled: true,
      interval: 60,
      lastAt: 5,
    });
    expect(readReminders('x@y.z').enabled).toBe(false);
  });
});
