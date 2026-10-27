// The goal is celebrated only when a change crosses it, so loading a day
// that is already complete, or editing another day, stays quiet.
export const didReachGoal = (beforeMl, afterMl, goalMl) =>
  beforeMl < goalMl && afterMl >= goalMl;

// Achievements already announced to a user in this browser, by email, so
// each one is celebrated once.
const STORAGE_KEY = 'achievementsSeen';

const readSeen = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
};

export const takeNewAchievements = (email, unlockedIds) => {
  const seen = readSeen();
  const known = seen[email] ?? [];
  const fresh = unlockedIds.filter(id => !known.includes(id));

  if (fresh.length) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...seen, [email]: [...known, ...fresh] })
      );
    } catch {
      // Without storage an achievement may be announced again: harmless.
    }
  }

  return fresh;
};
