import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { describe, expect, it, vi } from 'vitest';
import { waterReducer } from '../../../redux/water/slice.js';
import QuickAmounts from './QuickAmounts.jsx';

const renderChips = ({ weekWater = [], value = 50, onSelect = vi.fn() }) => {
  const store = configureStore({
    reducer: { water: waterReducer },
    preloadedState: {
      water: {
        dayWater: [],
        dayKey: null,
        monthWater: [],
        monthKey: null,
        weekWater,
        isLoading: false,
      },
    },
  });

  render(
    <Provider store={store}>
      <QuickAmounts value={value} onSelect={onSelect} />
    </Provider>
  );

  return onSelect;
};

const entry = usedWater => ({
  _id: `w${usedWater}`,
  usedWater,
  drinkingTime: '2026-10-27T10:00:00',
});

describe('QuickAmounts', () => {
  it('offers the preset amounts in a labelled group', () => {
    renderChips({});

    const group = screen.getByRole('group', { name: 'Quick amounts' });
    const labels = Array.from(group.querySelectorAll('button')).map(
      button => button.textContent
    );

    expect(labels).toEqual(['150 ml', '250 ml', '330 ml', '500 ml']);
  });

  it('reports the chosen amount in milliliters', () => {
    const onSelect = renderChips({});

    fireEvent.click(screen.getByRole('button', { name: '330 ml' }));

    expect(onSelect).toHaveBeenCalledWith(330);
  });

  it('marks only the chip that matches the current value as pressed', () => {
    renderChips({ value: '250' });

    expect(screen.getByRole('button', { name: '250 ml' })).toHaveProperty(
      'ariaPressed',
      'true'
    );
    expect(screen.getByRole('button', { name: '150 ml' })).toHaveProperty(
      'ariaPressed',
      'false'
    );
  });

  it('repeats the last entry when it is not already a preset', () => {
    const onSelect = renderChips({ weekWater: [entry(270)] });

    fireEvent.click(
      screen.getByRole('button', { name: 'Same as last time: 270 ml' })
    );

    expect(onSelect).toHaveBeenCalledWith(270);
  });

  it('does not duplicate a preset with a repeat chip', () => {
    renderChips({ weekWater: [entry(250)] });

    expect(screen.queryByText(/Same as last time/)).toBeNull();
  });
});
