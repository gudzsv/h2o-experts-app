import { act, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('react-hot-toast', () => ({ default: vi.fn() }));

import toast from 'react-hot-toast';
import { readReminders, saveReminders } from '../../helpers/reminders.js';
import { createTestStore } from '../../test/store.js';
import ReminderScheduler from './ReminderScheduler.jsx';

const email = 'test@example.com';
const today = '2024-03-10';

const renderScheduler = weekWater =>
  render(
    <Provider
      store={createTestStore({
        units: 'ml',
        user: { email, dailyRequirement: 2000 },
        weekWater,
      })}
    >
      <ReminderScheduler />
    </Provider>
  );

describe('ReminderScheduler', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date(`${today}T12:00:00`));
  });
  afterEach(() => vi.useRealTimers());

  it('reminds once a minute has passed, with what is left today', () => {
    saveReminders(email, { enabled: true });
    renderScheduler([
      { _id: '1', usedWater: 500, drinkingTime: `${today}T09:00:00` },
    ]);

    // Nothing right after signing in.
    expect(toast).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(60 * 1000));
    expect(toast).toHaveBeenCalledWith(
      "Time for some water! 1.5 L left to today's goal.",
      expect.objectContaining({ id: 'drink-reminder' })
    );
    expect(readReminders(email).lastAt).toBe(Date.now());

    // The next one waits for the interval.
    act(() => vi.advanceTimersByTime(60 * 1000));
    expect(toast).toHaveBeenCalledTimes(1);
  });

  it('stays quiet after a recent drink or when reminders are off', () => {
    saveReminders(email, { enabled: true });
    const { unmount } = renderScheduler([
      { _id: '1', usedWater: 500, drinkingTime: `${today}T11:30:00` },
    ]);
    act(() => vi.advanceTimersByTime(60 * 1000));
    unmount();

    saveReminders(email, { enabled: false });
    renderScheduler([]);
    act(() => vi.advanceTimersByTime(60 * 1000));

    expect(toast).not.toHaveBeenCalled();
  });
});
