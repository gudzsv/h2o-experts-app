import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

import toast from 'react-hot-toast';
import { API } from '../../helpers/axios.js';
import { createTestStore } from '../../test/store.js';
import StatsPage from './StatsPage.jsx';

const day = (total, index) => ({
  date: `2024-03-${String(index + 1).padStart(2, '0')}`,
  total,
  goalMet: total >= 2000,
});

const makeStats = (overrides = {}) => ({
  dailyRequirement: 2000,
  currentStreak: 1,
  bestStreak: 4,
  weekAverage: 1700,
  monthAverage: 1800,
  completionRate: 70,
  totalGoalDays: 6,
  days: Array.from({ length: 30 }, (_, index) => day(index % 2 ? 2100 : 500, index)),
  ...overrides,
});

const renderPage = ({ units = 'ml', email } = {}) =>
  render(
    <HelmetProvider>
      <Provider store={createTestStore({ units, user: { email } })}>
        <MemoryRouter>
          <StatsPage />
        </MemoryRouter>
      </Provider>
    </HelmetProvider>
  );

describe('StatsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });
  afterEach(() => vi.restoreAllMocks());

  it('shows the loader until the stats arrive', async () => {
    vi.spyOn(API, 'get').mockResolvedValue({ data: { data: makeStats() } });
    renderPage();

    expect(screen.getByLabelText('puff-loading')).toBeTruthy();
    await screen.findByText('Current streak');
  });

  it('shows streaks, averages and achievements', async () => {
    vi.spyOn(API, 'get').mockResolvedValue({ data: { data: makeStats() } });
    renderPage();

    await screen.findByText('Current streak');
    expect(screen.getByText('1 day')).toBeTruthy();
    // The last day (today) has 2100 ml, above the 2000 ml goal.
    expect(
      screen.getByText("Today's goal is met, the streak goes on.")
    ).toBeTruthy();
    expect(screen.getByText('Record: 4 days. 3 days to go.')).toBeTruthy();
    expect(screen.getByText('70%')).toBeTruthy();
    expect(screen.getByText('1.7 L')).toBeTruthy();
    // Days alternate 500 and 2100 ml: 9900 ml this week against 8300 ml.
    expect(screen.getByText('+19%')).toBeTruthy();
    expect(screen.getByText('vs the previous 7 days', { exact: false })).toBeTruthy();
    expect(screen.queryByText('No water recorded yet.', { exact: false })).toBeNull();

    // Six days with the goal and a best streak of 4.
    expect(screen.getByText('Unlocked')).toBeTruthy();
    expect(screen.getByText('4 of 7')).toBeTruthy();
    expect(screen.getByText('4 of 30')).toBeTruthy();
    const bars = screen.getAllByRole('progressbar');
    expect(bars.map(bar => bar.getAttribute('aria-valuenow'))).toEqual([
      '4',
      '4',
    ]);
  });

  it('tells how much is left today to keep the streak', async () => {
    const days = makeStats().days.map((item, index, all) =>
      index === all.length - 1 ? { ...item, total: 500, goalMet: false } : item
    );
    vi.spyOn(API, 'get').mockResolvedValue({
      data: { data: makeStats({ days, currentStreak: 2, bestStreak: 2 }) },
    });
    renderPage();

    await screen.findByText(
      'Drink 1.5 L more today to keep the streak.'
    );
    expect(screen.getByText('This is your best streak so far!')).toBeTruthy();
  });

  it('shows the averages in ounces', async () => {
    vi.spyOn(API, 'get').mockResolvedValue({ data: { data: makeStats() } });
    renderPage({ units: 'oz' });

    // 1700 ml is about 57.5 oz
    await screen.findByText('57.5 oz');
  });

  it('offers to add water when nothing is recorded', async () => {
    const days = Array.from({ length: 30 }, (_, index) => day(0, index));
    vi.spyOn(API, 'get').mockResolvedValue({
      data: {
        data: makeStats({
          days,
          currentStreak: 0,
          bestStreak: 0,
          totalGoalDays: 0,
        }),
      },
    });
    renderPage();

    await screen.findByText('No water recorded yet.', { exact: false });
    expect(screen.getByText('Current streak')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Add your first drink' })).toBeTruthy();
  });

  it('shows an error and loads again on retry', async () => {
    const get = vi
      .spyOn(API, 'get')
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValue({ data: { data: makeStats() } });
    renderPage();

    await screen.findByRole('alert');
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));

    await waitFor(() => expect(get).toHaveBeenCalledTimes(2));
    await screen.findByText('Current streak');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('announces each unlocked achievement once', async () => {
    vi.spyOn(API, 'get').mockResolvedValue({ data: { data: makeStats() } });
    const { unmount } = renderPage({ email: 'a@b.c' });

    await screen.findByText('Current streak');
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        'New achievement: First day with the goal met',
        expect.objectContaining({ id: 'achievement-firstGoal' })
      )
    );
    expect(toast.success).toHaveBeenCalledTimes(1);

    unmount();
    renderPage({ email: 'a@b.c' });
    await screen.findByText('Current streak');
    expect(toast.success).toHaveBeenCalledTimes(1);
  });
});
