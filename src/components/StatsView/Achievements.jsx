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
        {getAchievements(stats).map(({ id, target, progress, unlocked }) => (
          <li
            key={id}
            className={clsx(css.achievement, unlocked && css.unlocked)}
          >
            <span className={css.achievementName}>
              {t(`stats.achievement.${id}`)}
            </span>
            <span className={css.achievementState}>
              {unlocked
                ? t('stats.unlocked')
                : t('stats.progress', { progress, target })}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Achievements;
