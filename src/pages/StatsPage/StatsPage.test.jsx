import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { API } from '../../helpers/axios.js';
import { createTestStore } from '../../test/store.js';
import StatsPage from './StatsPage.jsx';

// recharts needs real layout sizes, which jsdom does not have.
vi.mock('components/StatsView/StatsChart.jsx', () => ({
  default: ({ days }) => <div data-testid="chart">{days.length} days</div>,
}));

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

const renderPage = ({ units = 'ml' } = {}) =>
  render(
    <HelmetProvider>
      <Provider store={createTestStore({ units })}>
        <MemoryRouter>
          <StatsPage />
        </MemoryRouter>
      </Provider>
    </HelmetProvider>
  );

describe('StatsPage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('shows a loading message until the stats arrive', async () => {
    vi.spyOn(API, 'get').mockResolvedValue({ data: { data: makeStats() } });
    renderPage();

    expect(screen.getByText('Loading...')).toBeTruthy();
    await screen.findByText('Current streak');
  });

  it('shows streaks, averages, the chart and achievements', async () => {
    vi.spyOn(API, 'get').mockResolvedValue({ data: { data: makeStats() } });
    renderPage();

    await screen.findByText('Current streak');
    expect(screen.getByText('1 day')).toBeTruthy();
    expect(screen.getByText('4 days')).toBeTruthy();
    expect(screen.getByText('70%')).toBeTruthy();
    expect(screen.getByText('1.7 L')).toBeTruthy();
    expect(screen.getByTestId('chart')).toBeTruthy();

    // Six days with the goal and a best streak of 4.
    expect(screen.getByText('Unlocked')).toBeTruthy();
    expect(screen.getAllByText('4 of 7').length).toBe(1);
    expect(screen.getByText('4 of 30')).toBeTruthy();
  });

  it('shows the averages in ounces', async () => {
    vi.spyOn(API, 'get').mockResolvedValue({ data: { data: makeStats() } });
    renderPage({ units: 'oz' });

    // 1700 ml is about 57.5 oz
    await screen.findByText('57.5 oz');
  });

  it('offers to add water instead of an empty chart', async () => {
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
    expect(screen.queryByTestId('chart')).toBeNull();
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
});
