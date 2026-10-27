import { describe, expect, it } from 'vitest';
import { getAchievements, getUnlockedTiers } from './achievements.js';

const stats = overrides => ({
  totalGoalDays: 0,
  bestStreak: 0,
  totalMl: 0,
  earlyDays: 0,
  perfectWeeks: 0,
  ...overrides,
});
const byId = list => Object.fromEntries(list.map(item => [item.id, item]));

describe('getAchievements', () => {
  it('has nothing unlocked for a new user', () => {
    const list = getAchievements(stats());

    expect(list.map(({ id }) => id)).toEqual([
      'firstGoal',
      'streak',
      'volume',
      'earlyBird',
      'perfectWeek',
    ]);
    expect(list.every(({ level, progress }) => !level && !progress)).toBe(
      true
    );
  });

  it('unlocks the first goal after one day with the goal met', () => {
    const { firstGoal } = byId(getAchievements(stats({ totalGoalDays: 1 })));

    expect(firstGoal).toMatchObject({ level: 1, next: null });
  });

  it('aims at the next tier and counts the unlocked ones', () => {
    const { streak } = byId(getAchievements(stats({ bestStreak: 9 })));

    expect(streak.level).toBe(2);
    expect(streak.next).toMatchObject({ id: 'streak14', target: 14 });
    expect(streak.progress).toBe(9);
  });

  it('unlocks a tier at exactly its target', () => {
    const { streak } = byId(getAchievements(stats({ bestStreak: 7 })));

    expect(streak.tiers.map(({ unlocked }) => unlocked)).toEqual([
      true,
      true,
      false,
      false,
      false,
    ]);
  });

  it('has no next tier once all are unlocked', () => {
    const { volume } = byId(getAchievements(stats({ totalMl: 120000 })));

    expect(volume).toMatchObject({ level: 3, next: null, progress: 120000 });
  });

  it('leaves out tracks the server does not send yet', () => {
    const list = getAchievements({ totalGoalDays: 2, bestStreak: 3 });

    expect(list.map(({ id }) => id)).toEqual(['firstGoal', 'streak']);
  });
});

describe('getUnlockedTiers', () => {
  it('keeps the ids of the tiers from before the tiers existed', () => {
    const ids = getUnlockedTiers(
      stats({ totalGoalDays: 40, bestStreak: 30, totalMl: 50000 })
    ).map(({ id }) => id);

    expect(ids).toEqual([
      'firstGoal',
      'streak3',
      'streak7',
      'streak14',
      'streak30',
      'volume10',
      'volume50',
    ]);
  });
});
