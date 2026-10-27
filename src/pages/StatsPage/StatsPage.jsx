import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Container from 'components/Container/Container.jsx';
import Loader from 'components/Loader/Loader.jsx';
import StatsView from 'components/StatsView/StatsView.jsx';
import css from 'components/StatsView/StatsView.module.css';
import { getStats } from '../../redux/water/operations.js';
import { selectUser } from '../../redux/auth/selectors.js';
import { getUnlockedTiers } from '../../helpers/achievements.js';
import { takeNewAchievements } from '../../helpers/celebrations.js';
import { useAchievementName } from '../../hooks/useAchievementName.js';
import {
  selectIsStatsFailed,
  selectStats,
} from '../../redux/water/selectors.js';

const StatsPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const stats = useSelector(selectStats);
  const isFailed = useSelector(selectIsStatsFailed);

  // Always refetched: the water entries may have changed since the last visit.
  useEffect(() => {
    dispatch(getStats());
  }, [dispatch]);

  // Each achievement is announced once, the first time the page shows it.
  const email = useSelector(selectUser)?.email;
  const getName = useAchievementName();
  useEffect(() => {
    if (!stats || !email) {
      return;
    }

    const unlocked = getUnlockedTiers(stats);
    const fresh = takeNewAchievements(
      email,
      unlocked.map(({ id }) => id)
    ).map(id => unlocked.find(tier => tier.id === id));

    // New tiers can unlock several at once (for example, on the first visit
    // after the tiers appeared), so more than two make one toast.
    if (fresh.length > 2) {
      toast.success(t('celebrate.achievements', { count: fresh.length }), {
        id: 'achievements',
        icon: '🏆',
      });
      return;
    }

    // Newer toasts stack on top, so the last one is shown first to keep the
    // list in reading order.
    fresh.reverse().forEach(tier =>
      toast.success(t('celebrate.achievement', { name: getName(tier) }), {
        id: `achievement-${tier.id}`,
        icon: '🏆',
      })
    );
  }, [stats, email, t, getName]);

  return (
    <Container>
      <Helmet>
        <title>{t('pages.stats')}</title>
      </Helmet>
      <div className={css.page}>
        <Link to="/tracker" className={css.back}>
          {t('stats.back')}
        </Link>
        <h1 className={css.title}>{t('stats.title')}</h1>

        {isFailed && (
          <div role="alert" className={css.empty}>
            <p>{t('stats.error')}</p>
            <button
              type="button"
              className={css.retry}
              onClick={() => dispatch(getStats())}
            >
              {t('stats.retry')}
            </button>
          </div>
        )}
        {!isFailed && !stats && <Loader />}
        {stats && <StatsView stats={stats} />}
      </div>
    </Container>
  );
};

export default StatsPage;
