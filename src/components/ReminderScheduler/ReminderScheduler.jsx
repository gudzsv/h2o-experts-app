import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSelector, useStore } from 'react-redux';
import { selectUser } from '../../redux/auth/selectors.js';
import {
  selectTodayTotal,
  selectTodayWater,
} from '../../redux/water/selectors.js';
import {
  getLastDrinkAt,
  readReminders,
  saveReminders,
  shouldRemind,
} from '../../helpers/reminders.js';
import { useVolume } from '../../hooks/useVolume.js';

const CHECK_MS = 60 * 1000;

// A system notification goes through the service worker when there is one,
// because some browsers (Chrome on Android) do not allow `new Notification`.
const notify = async (title, body) => {
  const options = { body, icon: '/icons/pwa-192.png', tag: 'drink-reminder' };
  const registration = await navigator.serviceWorker?.getRegistration();

  if (registration) {
    await registration.showNotification(title, options);
    return;
  }
  const notification = new Notification(title, options);
  notification.onclick = () => window.focus();
};

// Checks once a minute while a user is signed in, and also when the tab
// becomes visible again, since browsers slow timers in hidden tabs. The first
// check waits a minute, so today's water has loaded and signing in is quiet.
const ReminderScheduler = () => {
  const { t } = useTranslation();
  const { format } = useVolume();
  const store = useStore();
  const email = useSelector(selectUser)?.email;

  useEffect(() => {
    if (!email) {
      return;
    }

    const check = () => {
      const state = store.getState();
      const settings = readReminders(email);
      const goal = state.auth.user?.dailyRequirement ?? 0;
      const total = selectTodayTotal(state);
      const now = new Date();

      if (
        !shouldRemind({
          settings,
          now,
          lastDrinkAt: getLastDrinkAt(selectTodayWater(state)),
          isGoalMet: goal > 0 && total >= goal,
        })
      ) {
        return;
      }

      saveReminders(email, { lastAt: now.getTime() });
      const body =
        goal > total
          ? t('reminders.left', { amount: format(goal - total) })
          : t('reminders.body');

      const canNotify =
        typeof Notification !== 'undefined' &&
        Notification.permission === 'granted';

      if (document.visibilityState === 'visible' || !canNotify) {
        toast(`${t('reminders.title')} ${body}`, {
          id: 'drink-reminder',
          icon: '💧',
          duration: 8000,
        });
        return;
      }
      notify(t('reminders.title'), body).catch(() => {});
    };

    const timer = setInterval(check, CHECK_MS);
    const onVisible = () => document.visibilityState === 'visible' && check();
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [email, store, t, format]);

  return null;
};

export default ReminderScheduler;
