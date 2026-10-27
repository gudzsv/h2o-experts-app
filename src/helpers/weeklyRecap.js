// A recap of the last Monday-Sunday week, built from the /water/stats `days`
// (the last 30 days, oldest first, the last one is today). It is shown once
// per week per email in this browser, on the first visit of a new week.
const STORAGE_KEY = 'weeklyRecapSeen';
const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK = 7;

const toTime = dateKey => Date.parse(`${dateKey}T00:00:00Z`);
const shiftDate = (dateKey, days) =>
  new Date(toTime(dateKey) + days * DAY_MS).toISOString().slice(0, 10);

// Monday of the week that holds the date (weeks start on Monday).
export const getWeekStart = dateKey => {
  const weekday = (new Date(toTime(dateKey)).getUTCDay() + 6) % 7;
  return shiftDate(dateKey, -weekday);
};

const getWeek = (days, monday) => {
  const sunday = shiftDate(monday, WEEK - 1);
  const week = days.filter(({ date }) => date >= monday && date <= sunday);
  return week.length === WEEK ? week : null;
};

const sumOf = week => week.reduce((sum, { total }) => sum + total, 0);

// Returns null when the last week had no water, so there is nothing to sum up.
export const getWeeklyRecap = ({ days }) => {
  const today = days.at(-1)?.date;
  if (!today) {
    return null;
  }

  const monday = shiftDate(getWeekStart(today), -WEEK);
  const week = getWeek(days, monday);
  const total = week ? sumOf(week) : 0;
  if (total === 0) {
    return null;
  }

  const previous = getWeek(days, shiftDate(monday, -WEEK));
  const previousTotal = previous ? sumOf(previous) : 0;
  const goalDays = week.filter(({ goalMet }) => goalMet).length;

  return {
    from: monday,
    to: shiftDate(monday, WEEK - 1),
    goalDays,
    total,
    average: Math.round(total / WEEK),
    bestDay: week.reduce((best, day) => (day.total > best.total ? day : best)),
    change: previousTotal
      ? Math.round(((total - previousTotal) / previousTotal) * 100)
      : null,
    // The aim for the new week: one more day with the goal, up to all seven.
    nextGoalDays: Math.min(goalDays + 1, WEEK),
  };
};

const readSeen = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
};

// The recap of a week is due once the week after it has started.
export const isRecapDue = (email, todayKey) =>
  Boolean(email) && readSeen()[email] !== getWeekStart(todayKey);

export const markRecapSeen = (email, todayKey) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...readSeen(), [email]: getWeekStart(todayKey) })
    );
  } catch {
    // Without storage the recap may show again this week, which is harmless.
  }
};
