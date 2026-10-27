import { describe, expect, it } from 'vitest';
import { getAchievements } from './achievements.js';

const stats = overrides => ({ totalGoalDays: 0, bestStreak: 0, ...overrides });
const byId = list => Object.fromEntries(list.map(item => [item.id, item]));

describe('getAchievements', () => {
  it('has nothing unlocked for a new user', () => {
    const list = getAchievements(stats());

    expect(list.every(item => !item.unlocked)).toBe(true);
    expect(list.every(item => item.progress === 0)).toBe(true);
  });

  it('unlocks the first goal after one day with the goal met', () => {
    const achievements = byId(getAchievements(stats({ totalGoalDays: 1 })));

    expect(achievements.firstGoal.unlocked).toBe(true);
    expect(achievements.streak7.unlocked).toBe(false);
  });

  it('shows progress towards a streak and caps it at the target', () => {
    const partial = byId(getAchievements(stats({ bestStreak: 4 })));
    expect(partial.streak7).toMatchObject({ progress: 4, unlocked: false });
    expect(partial.streak30.progress).toBe(4);

    const full = byId(getAchievements(stats({ bestStreak: 45 })));
    expect(full.streak7).toMatchObject({ progress: 7, unlocked: true });
    expect(full.streak30).toMatchObject({ progress: 30, unlocked: true });
  });

  it('unlocks a streak at exactly its target', () => {
    const achievements = byId(getAchievements(stats({ bestStreak: 7 })));

    expect(achievements.streak7.unlocked).toBe(true);
    expect(achievements.streak30.unlocked).toBe(false);
  });
});
