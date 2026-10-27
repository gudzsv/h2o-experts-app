import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { getAchievements } from '../../helpers/achievements.js';
import css from './StatsView.module.css';

const Achievements = ({ stats }) => {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="achievementsTitle">
      <h2 className={css.subtitle} id="achievementsTitle">
        {t('stats.achievements')}
      </h2>
      <ul className={css.achievements}>
        {getAchievements(stats).map(({ id, target, progress, unlocked }) => {
          const name = t(`stats.achievement.${id}`);

          return (
            <li
              key={id}
              className={clsx(css.achievement, unlocked && css.unlocked)}
            >
              <span className={css.achievementName}>{name}</span>
              <span className={css.achievementState}>
                {unlocked
                  ? t('stats.unlocked')
                  : t('stats.progress', { progress, target })}
              </span>
              {!unlocked && (
                <span
                  className={css.bar}
                  role="progressbar"
                  aria-label={name}
                  aria-valuemin={0}
                  aria-valuemax={target}
                  aria-valuenow={progress}
                >
                  <span
                    className={css.barFill}
                    style={{ width: `${(progress / target) * 100}%` }}
                  />
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Achievements;
