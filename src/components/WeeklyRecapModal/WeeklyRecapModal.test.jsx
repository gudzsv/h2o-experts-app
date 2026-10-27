import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { createTestStore } from '../../test/store.js';
import WeeklyRecapModal from './WeeklyRecapModal.jsx';

const recap = {
  from: '2024-03-04',
  to: '2024-03-10',
  goalDays: 5,
  total: 14600,
  average: 2086,
  bestDay: { date: '2024-03-06', total: 2600, goalMet: true },
  change: 12,
  nextGoalDays: 6,
};

const renderModal = overrides => {
  const onClose = vi.fn();
  render(
    <Provider store={createTestStore({ units: 'ml' })}>
      <MemoryRouter>
        <WeeklyRecapModal recap={{ ...recap, ...overrides }} onClose={onClose} />
      </MemoryRouter>
    </Provider>
  );
  return onClose;
};

describe('WeeklyRecapModal', () => {
  it('sums up the week with an aim for the next one', () => {
    renderModal();

    screen.getByRole('heading', { name: 'Your week' });
    screen.getByText('March 4 – 10');
    screen.getByText('5 of 7');
    screen.getByText('14.6 L');
    screen.getByText('+12%');
    screen.getByText('Best day: Wednesday, 2.6 L.');
    screen.getByText(
      'Great week! Aim for this week: 6 days with the goal met.'
    );
  });

  it('praises a perfect week and hides a missing comparison', () => {
    renderModal({ goalDays: 7, nextGoalDays: 7, change: null });

    screen.getByText('A perfect week: the goal every day! Keep it going.');
    expect(screen.queryByText('vs the week before')).toBeNull();
  });

  it('closes from both buttons', () => {
    const onClose = renderModal();

    // The modal's cross is also called Close, so the text button is used.
    fireEvent.click(screen.getByText('Close'));
    fireEvent.click(screen.getByRole('link', { name: 'See statistics' }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
