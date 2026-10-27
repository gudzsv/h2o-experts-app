import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { API } from '../../helpers/axios.js';
import { createTestStore } from '../../test/store.js';
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

const renderApp = ({ units } = {}) => {
  const store = createTestStore({ units });

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

  it('starts an added amount at a glass, with its unit in the label', () => {
    renderApp();

    fireEvent.click(screen.getByText('add today'));

    expect(
      screen.getByLabelText('Enter the value of the water used (ml):').value
    ).toBe('250');
    expect(screen.getByRole('button', { name: '250 ml' })).toHaveProperty(
      'ariaPressed',
      'true'
    );
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

  describe('with ounces', () => {
    const save = async () => {
      const button = screen.getByRole('button', { name: 'Save' });
      await waitFor(() => expect(button.disabled).toBe(false));
      fireEvent.click(button);
    };

    it('stores an added amount in milliliters', async () => {
      const post = vi.spyOn(API, 'post').mockResolvedValue({
        data: { data: { _id: 'new', usedWater: 237, drinkingTime: '' } },
      });
      renderApp({ units: 'oz' });

      fireEvent.click(screen.getByText('add today'));
      expect(
        screen.getByLabelText('Enter the value of the water used (oz):').value
      ).toBe('8');
      fireEvent.click(screen.getByRole('button', { name: '8 oz' }));
      await save();

      await waitFor(() => expect(post).toHaveBeenCalledTimes(1));
      expect(post.mock.calls[0][1].usedWater).toBe(237);
    });

    it('keeps the stored milliliters when an entry is saved untouched', async () => {
      const patch = vi.spyOn(API, 'patch').mockResolvedValue({
        data: { data: item },
      });
      renderApp({ units: 'oz' });

      fireEvent.click(screen.getByText('edit item'));
      // 400 ml is shown as 14 oz, but must not be rewritten as 414 ml.
      expect(
        screen.getByLabelText('Enter the value of the water used (oz):').value
      ).toBe('14');
      await save();

      await waitFor(() => expect(patch).toHaveBeenCalledTimes(1));
      expect(patch.mock.calls[0][0]).toBe('/water/w1');
      expect(patch.mock.calls[0][1].usedWater).toBe(400);
    });

    it('converts a changed amount in an edited entry', async () => {
      const patch = vi.spyOn(API, 'patch').mockResolvedValue({
        data: { data: item },
      });
      renderApp({ units: 'oz' });

      fireEvent.click(screen.getByText('edit item'));
      fireEvent.change(
        screen.getByLabelText('Enter the value of the water used (oz):'),
        { target: { value: '15' } }
      );
      await save();

      await waitFor(() => expect(patch).toHaveBeenCalledTimes(1));
      expect(patch.mock.calls[0][1].usedWater).toBe(444); // 15 oz
    });
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
