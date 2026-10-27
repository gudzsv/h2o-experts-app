import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { describe, expect, it, vi } from 'vitest';
import { createTestStore } from '../../../test/store.js';
import QuickAmounts from './QuickAmounts.jsx';

const renderChips = ({ value = 250, units, onSelect = vi.fn() }) => {
  render(
    <Provider store={createTestStore({ units })}>
      <QuickAmounts value={value} onSelect={onSelect} />
    </Provider>
  );

  return onSelect;
};

const labelsOf = () =>
  Array.from(
    screen
      .getByRole('group', { name: 'Quick amounts' })
      .querySelectorAll('button')
  ).map(button => button.textContent);

describe('QuickAmounts', () => {
  it('offers the preset amounts in a labelled group', () => {
    renderChips({});

    expect(labelsOf()).toEqual(['150 ml', '250 ml', '330 ml', '500 ml']);
  });

  it('reports the chosen amount', () => {
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

  it('has no pressed chip for a custom amount', () => {
    renderChips({ value: '300' });

    const pressed = Array.from(
      screen.getByRole('group').querySelectorAll('[aria-pressed=true]')
    );
    expect(pressed).toHaveLength(0);
  });

  it('shows ounce presets for oz users', () => {
    const onSelect = renderChips({ units: 'oz', value: 8 });

    expect(labelsOf()).toEqual(['4 oz', '8 oz', '12 oz', '16 oz']);
    expect(screen.getByRole('button', { name: '8 oz' })).toHaveProperty(
      'ariaPressed',
      'true'
    );

    fireEvent.click(screen.getByRole('button', { name: '12 oz' }));
    expect(onSelect).toHaveBeenCalledWith(12);
  });
});
