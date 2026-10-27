import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { API } from '../../helpers/axios.js';
import { needsOnboarding } from '../../helpers/onboarding.js';
import { createTestStore } from '../../test/store.js';
import OnboardingModal from './OnboardingModal.jsx';

const user = { name: 'Test', email: 'test@example.com', gender: 'female' };

const renderModal = ({ units = 'ml' } = {}) => {
  const patch = vi.spyOn(API, 'patch').mockResolvedValue({
    data: { data: { ...user, units } },
  });
  const onClose = vi.fn();

  render(
    <Provider store={createTestStore({ units, user })}>
      <OnboardingModal isOpen onClose={onClose} />
    </Provider>
  );

  const save = () => screen.getByRole('button', { name: 'Save and start' });
  const fill = (id, value) =>
    fireEvent.change(document.querySelector(id), { target: { value } });

  return { patch, onClose, save, fill };
};

describe('OnboardingModal', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it('disables saving until a weight is entered', () => {
    const { save, fill } = renderModal();
    expect(save().disabled).toBe(true);

    fill('#onboardingWeight', '60');
    expect(save().disabled).toBe(false);
  });

  it('shows the recommended norm live', () => {
    const { fill } = renderModal();

    fill('#onboardingWeight', '60');
    fill('#onboardingActivity', '2');

    // 60 * 0.03 + 2 * 0.4 = 2.6 L
    expect(screen.getByText('2600 ml')).toBeTruthy();
  });

  it('shows the norm in ounces', () => {
    const { fill } = renderModal({ units: 'oz' });

    fill('#onboardingWeight', '60');

    // 1.8 L is about 61 oz
    expect(screen.getByText('61 oz')).toBeTruthy();
  });

  it('saves the profile with the norm in ml and closes', async () => {
    const { patch, onClose, save, fill } = renderModal({ units: 'oz' });

    fill('#onboardingWeight', '60');
    fill('#onboardingActivity', '2');
    fireEvent.click(save());
    await waitFor(() => expect(patch).toHaveBeenCalledTimes(1));

    const body = patch.mock.calls[0][1];
    expect(body.get('weight')).toBe('60');
    expect(body.get('activityLevel')).toBe('2');
    expect(body.get('units')).toBe('oz');
    expect(body.get('dailyRequirement')).toBe('2600');
    expect(onClose).toHaveBeenCalledWith(false);
  });

  it('remembers a skip and does not save', () => {
    const { patch, onClose } = renderModal();

    fireEvent.click(screen.getByRole('button', { name: 'Skip for now' }));

    expect(patch).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledWith(false);
    expect(needsOnboarding(user)).toBe(false);
  });
});
