import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ModalTemplate } from 'components/Modal/Modal';
import { useVolume } from '../../hooks/useVolume.js';
import css from './WeeklyRecapModal.module.css';

// Date keys are calendar days, so they are formatted in UTC to stay the same
// day in every time zone.
const toDate = dateKey => new Date(`${dateKey}T00:00:00Z`);

const WeeklyRecapModal = ({ recap, onClose }) => {
  const { t, i18n } = useTranslation();
  const { format } = useVolume();
  const { from, to, goalDays, total, average, bestDay, change } = recap;

  const range = new Intl.DateTimeFormat(i18n.language, {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).formatRange(toDate(from), toDate(to));
  const weekday = new Intl.DateTimeFormat(i18n.language, {
    weekday: 'long',
    timeZone: 'UTC',
  }).format(toDate(bestDay.date));

  let message = t('weeklyRecap.nextGoal', { count: recap.nextGoalDays });
  if (goalDays === 7) {
    message = t('weeklyRecap.perfect');
  } else if (goalDays >= 5) {
    message = `${t('weeklyRecap.great')} ${message}`;
  }

  return (
    <ModalTemplate modalIsOpen closeModal={onClose}>
      <div
        className={css.wrapper}
        role="dialog"
        aria-labelledby="weeklyRecapTitle"
      >
        <h2 className={css.title} id="weeklyRecapTitle">
          {t('weeklyRecap.title')}
        </h2>
        <p className={css.range}>{range}</p>

        <ul className={css.tiles}>
          <li className={clsx(css.tile, goalDays === 7 && css.tileDone)}>
            <p className={css.value}>
              {t('weeklyRecap.goalDaysValue', { goalDays })}
            </p>
            <p className={css.label}>{t('weeklyRecap.goalDays')}</p>
          </li>
          <li className={css.tile}>
            <p className={css.value}>{format(total)}</p>
            <p className={css.label}>{t('weeklyRecap.total')}</p>
          </li>
          <li className={css.tile}>
            <p className={css.value}>{format(average)}</p>
            <p className={css.label}>{t('weeklyRecap.average')}</p>
          </li>
          {change !== null && (
            <li className={css.tile}>
              <p className={css.value}>
                {change > 0 ? `+${change}%` : `${change}%`}
              </p>
              <p className={css.label}>{t('weeklyRecap.change')}</p>
            </li>
          )}
        </ul>

        <p className={css.text}>
          {t('weeklyRecap.bestDay', {
            day: weekday,
            amount: format(bestDay.total),
          })}
        </p>
        <p className={clsx(css.text, css.message)}>{message}</p>

        <div className={css.actions}>
          <Link to="/stats" className={css.primary} onClick={onClose}>
            {t('weeklyRecap.toStats')}
          </Link>
          <button type="button" className={css.secondary} onClick={onClose}>
            {t('weeklyRecap.close')}
          </button>
        </div>
      </div>
    </ModalTemplate>
  );
};

export default WeeklyRecapModal;
