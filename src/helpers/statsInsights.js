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

export const DAY_PARTS = ['morning', 'afternoon', 'evening', 'night'];

// Share of the last 30 days' water by part of the day, with one tip when the
// pattern is worth changing. Returns null without data, including a server
// that does not send timeOfDay yet.
export const getTimeOfDay = ({ timeOfDay }) => {
  const total = timeOfDay
    ? DAY_PARTS.reduce((sum, id) => sum + timeOfDay[id], 0)
    : 0;
  if (total === 0) {
    return null;
  }

  const parts = DAY_PARTS.map(id => ({
    id,
    share: Math.round((timeOfDay[id] / total) * 100),
  }));
  const top = parts.reduce((best, part) =>
    part.share > best.share ? part : best
  ).id;
  const share = id => parts.find(part => part.id === id).share;

  let tip = null;
  if (share('evening') + share('night') >= 50) {
    tip = 'tipLate';
  } else if (share('morning') < 15) {
    tip = 'tipMorning';
  }

  return { parts, top, tip };
};
