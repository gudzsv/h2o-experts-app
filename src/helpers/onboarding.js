// The onboarding is for profiles that never entered a weight (new accounts,
// including Google sign-ups). Skipping it is remembered per email in this
// browser, so it is not shown again on every visit.
const STORAGE_KEY = 'onboardingSkipped';

const readSkipped = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
};

export const isOnboardingSkipped = email => readSkipped().includes(email);

export const skipOnboarding = email => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([...new Set([...readSkipped(), email])])
    );
  } catch {
    // Without storage the modal may show again, which is harmless.
  }
};

export const needsOnboarding = user =>
  Boolean(user?.email) && !user.weight && !isOnboardingSkipped(user.email);
