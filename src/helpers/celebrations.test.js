// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { didReachGoal, takeNewAchievements } from './celebrations.js';

describe('didReachGoal', () => {
  it('is true only when a change crosses the goal', () => {
    expect(didReachGoal(1800, 2000, 2000)).toBe(true);
    expect(didReachGoal(1800, 2500, 2000)).toBe(true);
  });

  it('stays quiet below the goal and once it is already met', () => {
    expect(didReachGoal(1000, 1500, 2000)).toBe(false);
    expect(didReachGoal(2000, 2300, 2000)).toBe(false);
    expect(didReachGoal(2300, 2300, 2000)).toBe(false);
  });
});

describe('takeNewAchievements', () => {
  beforeEach(() => localStorage.clear());

  it('returns each unlocked achievement once per email', () => {
    expect(takeNewAchievements('a@b.c', ['firstGoal'])).toEqual(['firstGoal']);
    expect(takeNewAchievements('a@b.c', ['firstGoal'])).toEqual([]);
    expect(takeNewAchievements('a@b.c', ['firstGoal', 'streak7'])).toEqual([
      'streak7',
    ]);
    expect(takeNewAchievements('other@b.c', ['firstGoal'])).toEqual([
      'firstGoal',
    ]);
  });

  it('survives a broken stored value', () => {
    localStorage.setItem('achievementsSeen', '{oops');

    expect(takeNewAchievements('a@b.c', ['firstGoal'])).toEqual(['firstGoal']);
  });
});
