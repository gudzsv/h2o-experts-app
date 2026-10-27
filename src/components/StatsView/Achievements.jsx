import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { getAchievements } from '../../helpers/achievements.js';
import { useAchievementName } from '../../hooks/useAchievementName.js';
import { useVolume } from '../../hooks/useVolume.js';
import css from './StatsView.module.css';

const Achievements = ({ stats }) => {
  const { t } = useTranslation();
  const { format, formatNorm } = useVolume();
  const getName = useAchievementName();

  return (
    <section aria-labelledby="achievementsTitle">
      <h2 className={css.subtitle} id="achievementsTitle">
        {t('stats.achievements')}
      </h2>
      <ul className={css.achievements}>
        {getAchievements(stats).map(
          ({ id, hint, tiers, level, next, progress }) => {
            const title = t(`stats.track.${id}.title`);
            // Volume targets are whole litres or ounces, like the daily norm.
            const progressText = next
              ? t('stats.progress', {
                  progress: id === 'volume' ? format(progress) : progress,
                  target: id === 'volume' ? formatNorm(next.target) : next.target,
                })
              : null;

            return (
              <li
                key={id}
                className={clsx(
                  css.achievement,
                  level > 0 && css.started,
                  !next && css.unlocked
                )}
              >
                <span className={css.achievementName}>{title}</span>
                {tiers.length > 1 && (
                  <span className={css.tiers}>
                    {t('stats.level', { level, total: tiers.length })}
                  </span>
                )}
                {hint && (
                  <span className={css.achievementHint}>
                    {t(`stats.track.${id}.hint`)}
                  </span>
                )}
                <span className={css.achievementGoal}>
                  {next
                    ? t('stats.next', { name: getName(next) })
                    : t(tiers.length > 1 ? 'stats.allTiers' : 'stats.done', {
                        name: getName(tiers.at(-1)),
                      })}
                </span>
                {next && (
                  <>
                    <span
                      className={css.bar}
                      role="progressbar"
                      aria-label={getName(next)}
                      aria-valuemin={0}
                      aria-valuemax={next.target}
                      aria-valuenow={progress}
                      aria-valuetext={progressText}
                    >
                      <span
                        className={css.barFill}
                        style={{ width: `${(progress / next.target) * 100}%` }}
                      />
                    </span>
                    <span className={css.achievementState}>
                      {progressText}
                    </span>
                  </>
                )}
              </li>
            );
          }
        )}
      </ul>
    </section>
  );
};

export default Achievements;
