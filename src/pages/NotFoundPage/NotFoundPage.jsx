import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import Container from 'components/Container/Container.jsx';
import PageContent from 'components/PageContent/PageContent.jsx';
import animationData from '../../assets/animation/404-animation.json';
import styles from './NotFoundPage.module.css';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <Helmet>
        <title>{t('pages.notFound')}</title>
      </Helmet>
      <PageContent>
        <div className={styles.sectionsWrapper}>
          <div className={styles.lottieContainer} aria-hidden="true">
            <Lottie
              animationData={animationData}
              loop={true}
              className={styles.lottieAnimation}
              role="img"
              aria-label={t('notFound.info')}
            />
          </div>
          <section
            className={styles.notFoundContent}
            aria-labelledby="not-found-title"
          >
            <h1 className={styles.notFoundTitle} id="not-found-title">
              {t('notFound.title')}
            </h1>
            <p className={styles.notFoundMessage}>{t('notFound.info')}</p>
            <p className={styles.notFoundSubMessage}>{t('notFound.advice')}</p>
            <Link
              to="/"
              className={styles.notFoundLink}
              aria-label={t('notFound.goBack')}
            >
              {t('notFound.goBack')}
            </Link>
          </section>
        </div>
      </PageContent>
    </Container>
  );
};

export default NotFoundPage;
