import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TimeOfDay from './TimeOfDay.jsx';

describe('TimeOfDay', () => {
  it('shows the share of each part and the top one', () => {
    render(
      <TimeOfDay
        stats={{
          timeOfDay: { morning: 500, afternoon: 1000, evening: 400, night: 100 },
        }}
      />
    );

    screen.getByRole('heading', { name: 'When you drink' });
    screen.getByText('Over 30 days, you drink the most in the afternoon.');
    expect(
      screen
        .getByRole('progressbar', { name: 'Morning' })
        .getAttribute('aria-valuenow')
    ).toBe('25');
    expect(screen.getAllByRole('progressbar')).toHaveLength(4);
  });

  it('renders nothing when the server sends no time of day', () => {
    const { container } = render(<TimeOfDay stats={{ days: [] }} />);

    expect(container.innerHTML).toBe('');
  });
});
