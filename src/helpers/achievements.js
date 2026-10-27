// Achievements are derived from the stats, so nothing extra is stored. They
// use all-time figures (`totalGoalDays`, `bestStreak`, `totalMl`...), so an
// unlocked tier stays unlocked after a streak breaks.
//
// Each track has tiers. Tier ids are stable (`streak7` and `streak30` predate
// the tiers), because the announced ones are remembered by id.
const TRACKS = [
  { id: 'firstGoal', field: 'totalGoalDays', targets: [1] },
  { id: 'streak', field: 'bestStreak', targets: [3, 7, 14, 30, 100] },
  { id: 'volume', field: 'totalMl', targets: [10000, 50000, 100000] },
  { id: 'earlyBird', field: 'earlyDays', targets: [7, 30], hint: true },
  { id: 'perfectWeek', field: 'perfectWeeks', targets: [1, 4, 12], hint: true },
];

const getTierId = (trackId, target) => {
  if (trackId === 'firstGoal') {
    return trackId;
  }
  // Volume tiers are named in litres: volume10, volume50, volume100.
  return `${trackId}${trackId === 'volume' ? target / 1000 : target}`;
};

// Tracks whose figure the server does not send yet are left out.
export const getAchievements = stats =>
  TRACKS.filter(({ field }) => typeof stats[field] === 'number').map(
    ({ id, field, targets, hint = false }) => {
      const value = stats[field];
      const tiers = targets.map(target => ({
        id: getTierId(id, target),
        track: id,
        target,
        unlocked: value >= target,
      }));
      const next = tiers.find(({ unlocked }) => !unlocked) ?? null;

      return {
        id,
        hint,
        tiers,
        level: tiers.filter(({ unlocked }) => unlocked).length,
        next,
        progress: next ? Math.min(value, next.target) : value,
      };
    }
  );

export const getUnlockedTiers = stats =>
  getAchievements(stats).flatMap(({ tiers }) =>
    tiers.filter(({ unlocked }) => unlocked)
  );
