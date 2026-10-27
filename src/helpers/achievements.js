// Achievements are derived from the stats, so nothing extra is stored. They
// use all-time figures (`totalGoalDays`, `bestStreak`), so an unlocked one
// stays unlocked after a streak breaks.
const ACHIEVEMENTS = [
  { id: 'firstGoal', target: 1, getValue: stats => stats.totalGoalDays },
  { id: 'streak7', target: 7, getValue: stats => stats.bestStreak },
  { id: 'streak30', target: 30, getValue: stats => stats.bestStreak },
];

export const getAchievements = stats =>
  ACHIEVEMENTS.map(({ id, target, getValue }) => {
    const value = getValue(stats);

    return {
      id,
      target,
      progress: Math.min(value, target),
      unlocked: value >= target,
    };
  });
