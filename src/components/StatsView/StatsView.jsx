import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getWeekChange } from '../../helpers/statsInsights.js';
import { useVolume } from '../../hooks/useVolume.js';
import Achievements from './Achievements.jsx';
import StreakCard from './StreakCard.jsx';
import TimeOfDay from './TimeOfDay.jsx';
import css from './StatsView.module.css';

const StatTile = ({ label, value, children }) => (
  <div className={css.tile}>
    <p className={css.tileValue}>{value}</p>
    <p className={css.tileLabel}>{label}</p>
    {children}
  </div>
);

const WeekChange = ({ change }) => {
  const { t } = useTranslation();
  const value = change > 0 ? `+${change}%` : `${change}%`;

  return (
    <p className={css.change}>
      <span className={clsx(css.changeValue, change > 0 && css.changeUp)}>
        {value}
      </span>{' '}
      {t('stats.weekChange')}
    </p>
  );
};

// The daily water chart already lives on the tracker (Month card), so this
// page only has what it does not show: streaks, averages, the time of day and
// achievements.
const StatsView = ({ stats }) => {
  const { t } = useTranslation();
  const { format } = useVolume();
  const hasWater = stats.days.some(({ total }) => total > 0);
  const weekChange = getWeekChange(stats);

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

      <StreakCard stats={stats} />

      <div className={css.tiles}>
        <StatTile
          label={t('stats.weekAverage')}
          value={format(stats.weekAverage)}
        >
          {weekChange !== null && <WeekChange change={weekChange} />}
        </StatTile>
        <StatTile
          label={t('stats.monthAverage')}
          value={format(stats.monthAverage)}
        />
        <StatTile
          label={t('stats.completionRate')}
          value={`${stats.completionRate}%`}
        />
      </div>

      <TimeOfDay stats={stats} />

      <Achievements stats={stats} />
    </>
  );
};

export default StatsView;
