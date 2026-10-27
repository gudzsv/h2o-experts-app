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

describe('WaterForm drink types', () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());

  const renderForm = props => {
    vi.spyOn(API, 'post').mockImplementation(async (_, body) => ({
      data: { data: { _id: 'new', ...body } },
    }));
    vi.spyOn(API, 'patch').mockImplementation(async (_, body) => ({
      data: { data: { _id: 'a', ...body } },
    }));
    render(
      <Provider store={createTestStore({ units: 'ml', user: { email: 'a@b.c' } })}>
        <WaterForm currentDay={todayKey} closeModal={vi.fn()} {...props} />
      </Provider>
    );
  };

  const save = async () => {
    const button = screen.getByRole('button', { name: 'Save' });
    await waitFor(() => expect(button.disabled).toBe(false));
    fireEvent.click(button);
  };

  it('does not send the type for plain water', async () => {
    renderForm({ actionType: 'add' });

    expect(
      screen.getByRole('radio', { name: 'Water' }).getAttribute('aria-checked')
    ).toBe('true');
    await save();

    await waitFor(() => expect(API.post).toHaveBeenCalledTimes(1));
    expect(API.post.mock.calls[0][1]).not.toHaveProperty('drinkType');
  });

  it('shows what a coffee counts and sends its type', async () => {
    renderForm({ actionType: 'add' });

    fireEvent.click(screen.getByRole('radio', { name: 'Coffee' }));
    fireEvent.click(screen.getByRole('button', { name: '250 ml' }));
    await screen.findByText('Counts toward the goal: 200 ml (80%)');
    await save();

    await waitFor(() => expect(API.post).toHaveBeenCalledTimes(1));
    expect(API.post.mock.calls[0][1]).toMatchObject({
      usedWater: 250,
      drinkType: 'coffee',
    });
  });

  it('sends water when an entry changes back to it', async () => {
    renderForm({
      actionType: 'edit',
      waterItem: { ...entry('a', 300), drinkType: 'tea', hydration: 270 },
    });

    expect(
      screen.getByRole('radio', { name: 'Tea' }).getAttribute('aria-checked')
    ).toBe('true');
    fireEvent.click(screen.getByRole('radio', { name: 'Water' }));
    await save();

    await waitFor(() => expect(API.patch).toHaveBeenCalledTimes(1));
    expect(API.patch.mock.calls[0][1]).toMatchObject({ drinkType: 'water' });
  });
});
