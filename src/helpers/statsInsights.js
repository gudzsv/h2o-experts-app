// Insights derived from the /water/stats response, so the page can explain
// the numbers without another request. `days` holds the last 30 days, oldest
// first, so its last item is today.
const WEEK = 7;

const average = days =>
  days.reduce((sum, { total }) => sum + total, 0) / days.length;

export const getStreakStatus = ({
  days,
  currentStreak,
  bestStreak,
  dailyRequirement,
}) => {
  const todayTotal = days.at(-1)?.total ?? 0;
  const isTodayMet = todayTotal >= dailyRequirement;

  return {
    isTodayMet,
    remainingMl: Math.max(dailyRequirement - todayTotal, 0),
    // A record only counts once there is a streak to speak of.
    isRecord: currentStreak > 0 && currentStreak >= bestStreak,
    daysToRecord: Math.max(bestStreak - currentStreak, 0),
  };
};

// Change of the last 7 days against the 7 days before, in percent. Returns
// null when the earlier week has no water, so a new user sees no comparison.
export const getWeekChange = ({ days }) => {
  if (days.length < WEEK * 2) {
    return null;
  }

  const previous = average(days.slice(-WEEK * 2, -WEEK));
  if (previous === 0) {
    return null;
  }

  const current = average(days.slice(-WEEK));
  return Math.round(((current - previous) / previous) * 100);
};
