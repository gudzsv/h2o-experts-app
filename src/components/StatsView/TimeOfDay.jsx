import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { getTimeOfDay } from '../../helpers/statsInsights.js';
import css from './StatsView.module.css';

const TimeOfDay = ({ stats }) => {
  const { t } = useTranslation();
  const timeOfDay = getTimeOfDay(stats);

  if (!timeOfDay) {
    return null;
  }

  const { parts, top, tip } = timeOfDay;

  return (
    <section aria-labelledby="timeOfDayTitle">
      <h2 className={css.subtitle} id="timeOfDayTitle">
        {t('stats.timeOfDay.title')}
      </h2>
      <p className={css.note}>
        {t('stats.timeOfDay.top', {
          part: t(`stats.timeOfDay.${top}.inPart`),
        })}
        {tip && ` ${t(`stats.timeOfDay.${tip}`)}`}
      </p>
      <ul className={css.parts}>
        {parts.map(({ id, share }) => {
          const name = t(`stats.timeOfDay.${id}.name`);

          return (
            <li key={id} className={clsx(css.tile, id === top && css.topPart)}>
              <p className={css.tileValue}>{share}%</p>
              <p className={css.partName}>{name}</p>
              <p className={css.tileLabel}>
                {t(`stats.timeOfDay.${id}.hours`)}
              </p>
              <span
                className={css.bar}
                role="progressbar"
                aria-label={name}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={share}
              >
                <span className={css.barFill} style={{ width: `${share}%` }} />
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default TimeOfDay;
