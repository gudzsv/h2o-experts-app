import { beforeEach, describe, expect, it, vi } from 'vitest';
import { subDays } from 'date-fns';

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

import toast from 'react-hot-toast';
import { API } from '../../helpers/axios.js';
import { getWeekRange, toDateKey, toMonthKey } from '../../helpers/date.js';
import {
  addWater,
  deleteWater,
  editWater,
  getDayWater,
  getMonthWater,
  getWeekWater,
} from './operations.js';
import { waterReducer } from './slice.js';
import { selectTodayWater } from './selectors.js';

const now = new Date();
const todayKey = toDateKey(now);
const yesterdayKey = toDateKey(subDays(now, 1));
const oldKey = toDateKey(subDays(now, 20));

const entry = (id, dateKey, usedWater = 250) => ({
  _id: id,
  usedWater,
  drinkingTime: `${dateKey}T10:00:00`,
});

const run = (state, action) => waterReducer(state, action);
const todayIds = state =>
  selectTodayWater({ water: state })
    .map(item => item._id)
    .sort();

describe('water reducer', () => {
  let state;

  beforeEach(() => {
    vi.clearAllMocks();
    state = waterReducer(undefined, { type: 'init' });
    state = run(
      state,
      getWeekWater.fulfilled(
        [entry('a', todayKey), entry('b', yesterdayKey)],
        'req'
      )
    );
  });

  it('derives today entries from the week list only', () => {
    expect(todayIds(state)).toEqual(['a']);
  });

  it('keeps today progress when another day is selected', () => {
    state = run(
      state,
      getDayWater.fulfilled(
        { date: [entry('b', yesterdayKey)] },
        'req',
        yesterdayKey
      )
    );

    expect(state.dayKey).toBe(yesterdayKey);
    expect(todayIds(state)).toEqual(['a']);
  });

  it('adds an entry only to the lists that show its date', () => {
    state = run(
      state,
      getDayWater.fulfilled({ date: [] }, 'req', yesterdayKey)
    );

    state = run(
      state,
      addWater.fulfilled({ data: entry('c', todayKey) }, 'req', {})
    );
    expect(state.dayWater).toHaveLength(0);
    expect(todayIds(state)).toEqual(['a', 'c']);

    state = run(
      state,
      addWater.fulfilled({ data: entry('d', yesterdayKey) }, 'req', {})
    );
    expect(state.dayWater.map(item => item._id)).toEqual(['d']);
    expect(todayIds(state)).toEqual(['a', 'c']);
  });

  it('replaces an edited entry instead of duplicating it', () => {
    state = run(
      state,
      editWater.fulfilled({ data: entry('a', todayKey, 777) }, 'req', {})
    );

    const today = selectTodayWater({ water: state });
    expect(today).toHaveLength(1);
    expect(today[0].usedWater).toBe(777);
  });

  it('removes an entry moved to a date outside the shown ranges', () => {
    state = run(
      state,
      editWater.fulfilled({ data: entry('a', oldKey) }, 'req', {})
    );

    expect(state.weekWater.some(item => item._id === 'a')).toBe(false);
    expect(todayIds(state)).toEqual([]);
  });

  it('updates the month list only for the loaded month', () => {
    state = run(
      state,
      getMonthWater.fulfilled({ date: [] }, 'req', toMonthKey(now))
    );
    state = run(
      state,
      addWater.fulfilled({ data: entry('m1', todayKey) }, 'req', {})
    );
    expect(state.monthWater).toHaveLength(1);

    state = run(state, getMonthWater.fulfilled({ date: [] }, 'req', '2000-01'));
    state = run(
      state,
      addWater.fulfilled({ data: entry('m2', todayKey) }, 'req', {})
    );
    expect(state.monthWater).toHaveLength(0);
  });

  it('removes a deleted entry from every list', () => {
    state = run(
      state,
      getDayWater.fulfilled({ date: [entry('a', todayKey)] }, 'req', todayKey)
    );
    state = run(
      state,
      deleteWater.fulfilled({ data: {}, waterId: 'a' }, 'req', 'a')
    );

    expect(state.dayWater).toHaveLength(0);
    expect(state.weekWater.some(item => item._id === 'a')).toBe(false);
  });

  it('shows an error toast and stops loading when a request fails', () => {
    state = run(state, getDayWater.pending('req', todayKey));
    expect(state.isLoading).toBe(true);

    state = run(state, getDayWater.rejected(null, 'req', todayKey));
    expect(state.isLoading).toBe(false);
    expect(toast.error).toHaveBeenCalledTimes(1);
  });
});

describe('getWeekWater', () => {
  it('requests every month the week touches and merges the results', async () => {
    const get = vi
      .spyOn(API, 'get')
      .mockImplementation(async url => ({
        data: { date: [entry(url, todayKey)] },
      }));
    const { monthKeys } = getWeekRange();

    const action = await getWeekWater()(vi.fn(), vi.fn(), undefined);

    expect(get.mock.calls.map(([url]) => url)).toEqual(
      monthKeys.map(key => `/water/month/${key}`)
    );
    expect(action.payload).toHaveLength(monthKeys.length);

    get.mockRestore();
  });
});
