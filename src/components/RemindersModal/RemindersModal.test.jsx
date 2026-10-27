import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

import { readReminders } from '../../helpers/reminders.js';
import { createTestStore } from '../../test/store.js';
import RemindersModal from './RemindersModal.jsx';

const email = 'test@example.com';

const renderModal = () => {
  const onClose = vi.fn();
  render(
    <Provider store={createTestStore({ units: 'ml', user: { email } })}>
      <RemindersModal isOpen onClose={onClose} />
    </Provider>
  );
  return { onClose, save: () => screen.getByRole('button', { name: 'Save' }) };
};

describe('RemindersModal', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it('keeps the fields off until reminders are on', () => {
    renderModal();
    const interval = screen.getByRole('radio', { name: '1.5 h' });

    expect(interval.checked).toBe(true);
    expect(interval.closest('fieldset').disabled).toBe(true);

    fireEvent.click(screen.getByRole('checkbox'));
    expect(interval.closest('fieldset').disabled).toBe(false);
  });

  it('saves the settings for this user', () => {
    const { onClose, save } = renderModal();

    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('radio', { name: '2 h' }));
    fireEvent.change(screen.getByLabelText('From'), {
      target: { value: '08:30' },
    });
    fireEvent.click(save());

    expect(readReminders(email)).toMatchObject({
      enabled: true,
      from: '08:30',
      to: '21:00',
      interval: 120,
    });
    expect(onClose).toHaveBeenCalled();
  });

  it('does not save a window that ends before it starts', () => {
    const { onClose, save } = renderModal();

    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.change(screen.getByLabelText('To'), {
      target: { value: '07:00' },
    });

    screen.getByText('The end must be later than the start.');
    expect(save().disabled).toBe(true);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('says reminders stay in the app without notifications', () => {
    // jsdom has no Notification API, like Safari on iOS outside an app.
    renderModal();
    fireEvent.click(screen.getByRole('checkbox'));

    screen.getByText(
      'Notifications are not allowed in this browser, so reminders will show inside the app.'
    );
  });
});
