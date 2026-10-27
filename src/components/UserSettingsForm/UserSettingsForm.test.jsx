import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { API } from '../../helpers/axios.js';
import { createTestStore } from '../../test/store.js';
import UserSettingsForm from './UserSettingsForm.jsx';

const user = {
  name: 'Test User',
  email: 'test@example.com',
  gender: 'female',
  weight: 60,
  activityLevel: 2,
  dailyRequirement: 2000,
  // The backend omits photo for users without one; `null` fails validation.
  photo: undefined,
};

const renderForm = ({ units = 'ml' } = {}) => {
  const patch = vi.spyOn(API, 'patch').mockResolvedValue({
    data: { data: { ...user, units } },
  });
  const onClose = vi.fn();
  const store = createTestStore({ units, user });

  render(
    <Provider store={store}>
      <UserSettingsForm onClose={onClose} />
    </Provider>
  );

  const norm = () => document.querySelector('#dailyRequirement');
  const save = async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(patch).toHaveBeenCalledTimes(1));
    return patch.mock.calls[0][1];
  };

  return { norm, save, onClose };
};

describe('UserSettingsForm units', () => {
  afterEach(() => vi.restoreAllMocks());

  it('shows the daily norm in the saved units', () => {
    const { norm } = renderForm({ units: 'oz' });

    expect(norm().value).toBe('68');
    expect(
      screen.getByText('Write down how much water you will drink (oz):')
    ).toBeTruthy();
  });

  it('converts the norm when the units change and back without drift', () => {
    const { norm } = renderForm();
    expect(norm().value).toBe('2000');

    fireEvent.click(screen.getByLabelText('oz'));
    expect(norm().value).toBe('68');

    fireEvent.click(screen.getByLabelText('ml'));
    expect(norm().value).toBe('2000');
  });

  it('saves the new units and keeps the norm in ml when it was not edited', async () => {
    const { save } = renderForm();

    fireEvent.click(screen.getByLabelText('oz'));
    const body = await save();

    expect(body.get('units')).toBe('oz');
    expect(body.get('dailyRequirement')).toBe('2000');
  });

  it('converts a norm typed in ounces to milliliters', async () => {
    const { norm, save } = renderForm();

    fireEvent.click(screen.getByLabelText('oz'));
    fireEvent.change(norm(), { target: { value: '70' } });
    const body = await save();

    expect(body.get('units')).toBe('oz');
    expect(body.get('dailyRequirement')).toBe('2070');
  });
});
