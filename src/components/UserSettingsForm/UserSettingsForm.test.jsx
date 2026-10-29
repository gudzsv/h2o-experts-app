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

  it('takes the recommended norm into the field and saves it in ml', async () => {
    const { norm, save } = renderForm();

    // 60 kg and 2 h of sport for a woman: 60 * 0.03 + 2 * 0.4 = 2.6 L
    fireEvent.click(
      screen.getByRole('button', { name: 'Use the recommended norm' })
    );
    expect(norm().value).toBe('2600');

    const body = await save();
    expect(body.get('dailyRequirement')).toBe('2600');
  });

  it('shows the recommended norm in ounces but saves the exact ml', async () => {
    const { norm, save } = renderForm({ units: 'oz' });

    fireEvent.click(
      screen.getByRole('button', { name: 'Use the recommended norm' })
    );
    expect(norm().value).toBe('88');

    const body = await save();
    expect(body.get('dailyRequirement')).toBe('2600');
  });

  it('follows the weight and gender when taking the recommended norm', () => {
    const { norm } = renderForm();

    fireEvent.click(screen.getByLabelText('Man'));
    fireEvent.change(document.querySelector('#userWeight'), {
      target: { value: '80' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: 'Use the recommended norm' })
    );

    // 80 * 0.04 + 2 * 0.6 = 4.4 L
    expect(norm().value).toBe('4400');
  });

  it('disables the button until the weight and activity are valid', () => {
    renderForm();

    fireEvent.change(document.querySelector('#userWeight'), {
      target: { value: 'abc' },
    });

    expect(
      screen.getByRole('button', { name: 'Use the recommended norm' }).disabled
    ).toBe(true);
  });

  it('converts a norm typed in ounces to milliliters', async () => {
    const { norm, save } = renderForm();

    fireEvent.click(screen.getByLabelText('oz'));
    fireEvent.change(norm(), { target: { value: '70' } });
    const body = await save();

    expect(body.get('units')).toBe('oz');
    expect(body.get('dailyRequirement')).toBe('2070');
  });

  // The onboarding allows 0 hours of activity, so the settings must too.
  it('saves zero hours of activity and rejects a negative value', async () => {
    const { save } = renderForm();
    const activity = document.querySelector('#userTime');

    // The form validates a field once it has been left.
    fireEvent.change(activity, { target: { value: '-1' } });
    fireEvent.blur(activity);
    await screen.findByText('Active time cannot be negative');

    fireEvent.change(activity, { target: { value: '0' } });
    const body = await save();

    expect(body.get('activityLevel')).toBe('0');
    expect(screen.queryByText('Active time cannot be negative')).toBeNull();
  });
});
