import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useVolume } from '../../hooks/useVolume.js';
import Achievements from './Achievements.jsx';
import css from './StatsView.module.css';

const StatTile = ({ label, value }) => (
  <div className={css.tile}>
    <p className={css.tileValue}>{value}</p>
    <p className={css.tileLabel}>{label}</p>
  </div>
);

// The daily water chart already lives on the tracker (Month card), so this
// page only has what it does not show: streaks, averages and achievements.
const StatsView = ({ stats }) => {
  const { t } = useTranslation();
  const { format } = useVolume();
  const hasWater = stats.days.some(({ total }) => total > 0);

  return (
    <>
      {!hasWater && (
        <p className={css.empty}>
          {t('stats.empty')}{' '}
          <Link to="/tracker" className={css.link}>
            {t('stats.toTracker')}
          </Link>
        </p>
      )}

      <div className={css.tiles}>
        <StatTile
          label={t('stats.currentStreak')}
          value={t('stats.days', { count: stats.currentStreak })}
        />
        <StatTile
          label={t('stats.bestStreak')}
          value={t('stats.days', { count: stats.bestStreak })}
        />
        <StatTile
          label={t('stats.completionRate')}
          value={`${stats.completionRate}%`}
        />
        <StatTile
          label={t('stats.weekAverage')}
          value={format(stats.weekAverage)}
        />
        <StatTile
          label={t('stats.monthAverage')}
          value={format(stats.monthAverage)}
        />
      </div>

      <Achievements stats={stats} />
    </>
  );
};

export default StatsView;
