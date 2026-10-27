// Reminders to drink live in this browser, per email: notification
// permission belongs to the device too, and the server cannot send them
// (it sleeps on free hosting). They only fire while the app is open.
const STORAGE_KEY = 'reminders';
const MINUTE_MS = 60 * 1000;

export const INTERVALS = [60, 90, 120, 180];

export const DEFAULT_REMINDERS = {
  enabled: false,
  from: '09:00',
  to: '21:00',
  interval: 90,
  lastAt: null,
};

const readAll = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
};

export const readReminders = email => ({
  ...DEFAULT_REMINDERS,
  ...readAll()[email],
});

export const saveReminders = (email, changes) => {
  const all = readAll();
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...all, [email]: { ...readReminders(email), ...changes } })
    );
  } catch {
    // Without storage reminders stay off, which is harmless.
  }
};

const toMinutes = time => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const isValidWindow = ({ from, to }) =>
  Boolean(from && to) && toMinutes(from) < toMinutes(to);

// The latest of today's entries, as a local time (drinkingTime has no zone).
export const getLastDrinkAt = todayWater =>
  todayWater.reduce((latest, { drinkingTime }) => {
    const time = new Date(drinkingTime).getTime();
    return Number.isNaN(time) || time < latest ? latest : time;
  }, 0) || null;

// Reminds inside the window once `interval` minutes have passed since the
// last drink or the last reminder. With neither, it reminds right away.
export const shouldRemind = ({ settings, now, lastDrinkAt, isGoalMet }) => {
  if (!settings.enabled || isGoalMet || !isValidWindow(settings)) {
    return false;
  }

  const minutes = now.getHours() * 60 + now.getMinutes();
  if (minutes < toMinutes(settings.from) || minutes >= toMinutes(settings.to)) {
    return false;
  }

  const lastActivity = Math.max(lastDrinkAt ?? 0, settings.lastAt ?? 0);
  return now.getTime() - lastActivity >= settings.interval * MINUTE_MS;
};
