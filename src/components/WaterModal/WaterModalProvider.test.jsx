import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { API } from '../../helpers/axios.js';
import { waterReducer } from '../../redux/water/slice.js';
import WaterModalProvider from './WaterModalProvider.jsx';
import { useWaterModal } from './waterModalContext.js';

const item = {
  _id: 'w1',
  usedWater: 400,
  drinkingTime: '2026-10-20T09:30:00',
};

const Openers = () => {
  const { openAdd, openEdit } = useWaterModal();

  return (
    <>
      <button onClick={() => openAdd()}>add today</button>
      <button onClick={() => openAdd('2026-10-15')}>add 15th</button>
      <button onClick={() => openEdit(item)}>edit item</button>
    </>
  );
};

const renderApp = () => {
  const store = configureStore({ reducer: { water: waterReducer } });

  render(
    <Provider store={store}>
      <WaterModalProvider>
        <Openers />
      </WaterModalProvider>
    </Provider>
  );
};

describe('WaterModalProvider', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders nothing until a modal is requested', () => {
    renderApp();

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('opens one add dialog with quick amounts', () => {
    renderApp();

    fireEvent.click(screen.getByText('add today'));

    expect(screen.getAllByRole('dialog')).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'Add water' })).toBeTruthy();
    expect(screen.getByRole('group', { name: 'Quick amounts' })).toBeTruthy();
  });

  it('opens the edit dialog for an entry without quick amounts', () => {
    renderApp();

    fireEvent.click(screen.getByText('edit item'));

    expect(
      screen.getByRole('heading', { name: 'Edit the entered amount of water' })
    ).toBeTruthy();
    expect(screen.queryByRole('group', { name: 'Quick amounts' })).toBeNull();
    expect(screen.getByLabelText('Recording time:').value).toBe('09:30');
  });

  it('adds water for the day it was opened for', async () => {
    const post = vi.spyOn(API, 'post').mockResolvedValue({
      data: { data: { _id: 'new', usedWater: 330, drinkingTime: '' } },
    });
    renderApp();

    fireEvent.click(screen.getByText('add 15th'));
    fireEvent.click(screen.getByRole('button', { name: '330 ml' }));
    const save = screen.getByRole('button', { name: 'Save' });
    await waitFor(() => expect(save.disabled).toBe(false));
    fireEvent.click(save);

    await waitFor(() => expect(post).toHaveBeenCalledTimes(1));
    const [url, body] = post.mock.calls[0];
    expect(url).toBe('/water');
    expect(body.usedWater).toBe(330);
    expect(body.drinkingTime.startsWith('2026-10-15T')).toBe(true);
  });
});
