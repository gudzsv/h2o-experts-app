import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { subDays } from 'date-fns';
import ChooseDate from './ChooseDate.jsx';

describe('ChooseDate', () => {
  it('shows "Today" and no way back for today', () => {
    render(<ChooseDate selectedDate={new Date()} onToday={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Today' })).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('offers a way back to today for another day', () => {
    const onToday = vi.fn();
    render(
      <ChooseDate selectedDate={subDays(new Date(), 2)} onToday={onToday} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Back to today' }));

    expect(onToday).toHaveBeenCalledTimes(1);
  });
});
