import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Container from 'components/Container/Container.jsx';
import Loader from 'components/Loader/Loader.jsx';
import StatsView from 'components/StatsView/StatsView.jsx';
import css from 'components/StatsView/StatsView.module.css';
import { getStats } from '../../redux/water/operations.js';
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
