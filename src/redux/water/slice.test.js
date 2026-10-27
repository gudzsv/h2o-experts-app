import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
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
  getStats,
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
// A read as the app makes it: the request starts, then its response lands.
const load = (state, thunk, payload, arg, requestId = 'req') =>
  run(run(state, thunk.pending(requestId, arg)), thunk.fulfilled(payload, requestId, arg));
const todayIds = state =>
  selectTodayWater({ water: state })
    .map(item => item._id)
    .sort();

describe('water reducer', () => {
  let state;

  beforeEach(() => {
    vi.clearAllMocks();
    state = waterReducer(undefined, { type: 'init' });
    state = load(state, getWeekWater, [
      entry('a', todayKey),
      entry('b', yesterdayKey),
    ]);
  });

  it('derives today entries from the week list only', () => {
    expect(todayIds(state)).toEqual(['a']);
  });

  it('keeps today progress when another day is selected', () => {
    state = load(
      state,
      getDayWater,
      { date: [entry('b', yesterdayKey)] },
      yesterdayKey
    );

    expect(state.dayKey).toBe(yesterdayKey);
    expect(todayIds(state)).toEqual(['a']);
  });

  it('adds an entry only to the lists that show its date', () => {
    state = load(state, getDayWater, { date: [] }, yesterdayKey);

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
    state = load(state, getMonthWater, { date: [] }, toMonthKey(now));
    state = run(
      state,
      addWater.fulfilled({ data: entry('m1', todayKey) }, 'req', {})
    );
    expect(state.monthWater).toHaveLength(1);

    state = load(state, getMonthWater, { date: [] }, '2000-01');
    state = run(
      state,
      addWater.fulfilled({ data: entry('m2', todayKey) }, 'req', {})
    );
    expect(state.monthWater).toHaveLength(0);
  });

  it('removes a deleted entry from every list', () => {
    state = load(state, getDayWater, { date: [entry('a', todayKey)] }, todayKey);
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

  it('ignores a slow response when a newer read of the list started', () => {
    // Day A is requested, then day B; A's answer arrives last.
    state = run(state, getDayWater.pending('a', yesterdayKey));
    state = run(state, getDayWater.pending('b', todayKey));
    state = run(
      state,
      getDayWater.fulfilled({ date: [entry('t', todayKey)] }, 'b', todayKey)
    );
    state = run(
      state,
      getDayWater.fulfilled(
        { date: [entry('y', yesterdayKey)] },
        'a',
        yesterdayKey
      )
    );

    expect(state.dayKey).toBe(todayKey);
    expect(state.dayWater.map(item => item._id)).toEqual(['t']);
    expect(state.isLoading).toBe(false);
  });

  it('does not show an error for a read that was replaced', () => {
    state = run(state, getWeekWater.pending('old'));
    state = run(state, getWeekWater.pending('new'));
    state = run(state, getWeekWater.rejected(null, 'old'));

    expect(toast.error).not.toHaveBeenCalled();
    expect(state.isLoading).toBe(true);
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

describe('getStats', () => {
  const stats = { currentStreak: 3, days: [] };

  beforeEach(() => vi.clearAllMocks());

  it('sends the local date and returns the stats', async () => {
    const get = vi
      .spyOn(API, 'get')
      .mockResolvedValue({ data: { data: stats } });

    const action = await getStats()(vi.fn(), vi.fn(), undefined);

    expect(get).toHaveBeenCalledWith('/water/stats', {
      params: { today: todayKey },
    });
    expect(action.payload).toEqual(stats);

    get.mockRestore();
  });

  it('keeps its failure apart from the tracker loading and toasts', () => {
    let state = waterReducer(undefined, { type: 'init' });

    state = run(state, getStats.rejected(null, 'req'));
    expect(state.isStatsFailed).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(toast.error).not.toHaveBeenCalled();

    state = run(state, getStats.pending('req'));
    expect(state.isStatsFailed).toBe(false);

    state = run(state, getStats.fulfilled(stats, 'req'));
    expect(state.stats).toEqual(stats);
  });
});

describe('writes during a slow read', () => {
  // Resolvers for each GET, in call order, so a test decides when (and in
  // which order) the server answers.
  const deferGets = () => {
    const pending = [];
    const get = vi.spyOn(API, 'get').mockImplementation(
      url =>
        new Promise(resolve => {
          pending.push({ url, resolve });
        })
    );
    return { get, pending };
  };

  const makeStore = () =>
    configureStore({
      reducer: { water: waterReducer },
      middleware: getDefault => getDefault({ serializableCheck: false }),
    });

  afterEach(() => vi.restoreAllMocks());

  it('keeps an added entry when an older week read answers after it', async () => {
    const store = makeStore();
    const { get, pending } = deferGets();
    vi.spyOn(API, 'post').mockResolvedValue({
      data: { data: entry('new', todayKey, 400) },
    });

    store.dispatch(getWeekWater());
    await store.dispatch(addWater({}));

    // The write asked for the week again.
    const monthCalls = get.mock.calls.filter(([url]) =>
      url.startsWith('/water/month/')
    );
    const { monthKeys } = getWeekRange();
    expect(monthCalls).toHaveLength(monthKeys.length * 2);

    // The old read (made before the write) answers last but is ignored...
    const [oldReads, newReads] = [
      pending.slice(0, monthKeys.length),
      pending.slice(monthKeys.length),
    ];
    newReads.forEach(({ resolve }, index) =>
      resolve({
        data: { date: index === 0 ? [entry('new', todayKey, 400)] : [] },
      })
    );
    await vi.waitFor(() =>
      expect(store.getState().water.reads.week).toBeNull()
    );
    oldReads.forEach(({ resolve }) => resolve({ data: { date: [] } }));
    await new Promise(resolve => setTimeout(resolve, 0));

    // ...so today still has the new entry.
    expect(selectTodayWater(store.getState()).map(item => item._id)).toEqual([
      'new',
    ]);
  });

  it('asks again for the day list that was loading during a delete', async () => {
    const store = makeStore();
    const { get } = deferGets();
    vi.spyOn(API, 'delete').mockResolvedValue({ data: {} });

    store.dispatch(getDayWater(todayKey));
    await store.dispatch(deleteWater('a'));

    expect(get.mock.calls.map(([url]) => url)).toEqual([
      `/water/day/${todayKey}`,
      `/water/day/${todayKey}`,
    ]);
  });

  it('does not read again when nothing was loading', async () => {
    const store = makeStore();
    const get = vi.spyOn(API, 'get');
    vi.spyOn(API, 'post').mockResolvedValue({
      data: { data: entry('new', todayKey) },
    });

    await store.dispatch(addWater({}));

    expect(get).not.toHaveBeenCalled();
  });
});
