import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn(), dismiss: vi.fn() },
}));

import toast from 'react-hot-toast';
import { API } from '../../../helpers/axios.js';
import { toDateKey } from '../../../helpers/date.js';
import { createTestStore } from '../../../test/store.js';
import WaterForm from './WaterForm.jsx';

const todayKey = toDateKey(new Date());
const entry = (id, usedWater, dateKey = todayKey) => ({
  _id: id,
  usedWater,
  drinkingTime: `${dateKey}T09:00:00`,
});

// Adds 330 ml for `day` with `weekWater` already loaded.
const add330 = async ({ weekWater, day = todayKey }) => {
  vi.spyOn(API, 'post').mockImplementation(async (_, body) => ({
    data: { data: { _id: 'new', ...body } },
  }));
  const store = createTestStore({
    units: 'ml',
    user: { email: 'a@b.c', dailyRequirement: 2000 },
    weekWater,
  });

  render(
    <Provider store={store}>
      <WaterForm actionType="add" currentDay={day} closeModal={vi.fn()} />
    </Provider>
  );

  fireEvent.click(screen.getByRole('button', { name: '330 ml' }));
  const save = screen.getByRole('button', { name: 'Save' });
  await waitFor(() => expect(save.disabled).toBe(false));
  fireEvent.click(save);
  await waitFor(() => expect(API.post).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(toast.success).toHaveBeenCalled());
};

const goalToasts = () =>
  toast.success.mock.calls.filter(([, options]) => options?.id === 'goal-met');

describe('WaterForm goal celebration', () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it('celebrates when an entry crosses the daily goal', async () => {
    await add330({ weekWater: [entry('a', 1800)] });

    expect(goalToasts()).toHaveLength(1);
    expect(toast.dismiss).toHaveBeenCalledWith('toasts.success.ADD_WATER');
  });

  it('stays quiet when the goal was already met', async () => {
    await add330({ weekWater: [entry('a', 2100)] });

    expect(goalToasts()).toHaveLength(0);
  });

  it('stays quiet below the goal', async () => {
    await add330({ weekWater: [entry('a', 500)] });

    expect(goalToasts()).toHaveLength(0);
  });
});
