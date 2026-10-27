// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { needsOnboarding, skipOnboarding } from './onboarding.js';

describe('needsOnboarding', () => {
  beforeEach(() => localStorage.clear());

  it('is needed for a profile without a weight', () => {
    expect(needsOnboarding({ email: 'a@b.c' })).toBe(true);
  });

  it('is not needed once a weight is saved', () => {
    expect(needsOnboarding({ email: 'a@b.c', weight: 60 })).toBe(false);
  });

  it('is not needed before the user is loaded', () => {
    expect(needsOnboarding({})).toBe(false);
    expect(needsOnboarding(undefined)).toBe(false);
  });

  it('remembers a skip per email', () => {
    skipOnboarding('a@b.c');

    expect(needsOnboarding({ email: 'a@b.c' })).toBe(false);
    expect(needsOnboarding({ email: 'other@b.c' })).toBe(true);
  });

  it('survives a broken stored value', () => {
    localStorage.setItem('onboardingSkipped', '{oops');

    expect(needsOnboarding({ email: 'a@b.c' })).toBe(true);
  });
});
