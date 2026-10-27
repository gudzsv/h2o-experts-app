import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { getStreakStatus } from '../../helpers/statsInsights.js';
import { useVolume } from '../../hooks/useVolume.js';
import css from './StatsView.module.css';

// The streak with what it needs today, so the page gives a reason to come
// back tomorrow rather than only a number.
const StreakCard = ({ stats }) => {
  const { t } = useTranslation();
  const { format } = useVolume();
  const { currentStreak, bestStreak } = stats;
  const { isTodayMet, remainingMl, isRecord, daysToRecord } =
    getStreakStatus(stats);

  const status = isTodayMet
    ? t('stats.todayMet')
    : t(currentStreak > 0 ? 'stats.keepStreak' : 'stats.startStreak', {
        amount: format(remainingMl),
      });

  return (
    <section
      className={clsx(css.streak, isTodayMet && css.streakMet)}
      aria-labelledby="streakTitle"
    >
      <h2 className={css.streakLabel} id="streakTitle">
        {t('stats.currentStreak')}
      </h2>
      <p className={css.streakValue}>
        {t('stats.days', { count: currentStreak })}
      </p>
      <p className={css.streakText}>{status}</p>
      {bestStreak > 0 && (
        <p className={css.streakText}>
          {isRecord
            ? t('stats.isRecord')
            : t('stats.toRecord', {
                best: t('stats.days', { count: bestStreak }),
                left: t('stats.days', { count: daysToRecord }),
              })}
        </p>
      )}
    </section>
  );
};

export default StreakCard;
