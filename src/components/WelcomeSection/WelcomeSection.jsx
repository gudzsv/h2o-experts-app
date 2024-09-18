import { useTranslation } from 'react-i18next';
import Logo from '../Logo/Logo';
import { Link } from 'react-router-dom';
import styles from './WelcomeSection.module.css';

const WelcomeSection = () => {
  const { t } = useTranslation();

  return (
    <section
      className={styles.welcomeSection}
      aria-labelledby="welcome-heading"
    >
      <Logo className={styles.welcomeLogo} />

      <div className={styles.welcomeContainer}>
        <p className={styles.welcomeTopText}>{t('homepage.welcome.text')}</p>
        <h1 className={styles.welcomeTitle}>{t('homepage.welcome.title')}</h1>

        <div className={styles.welcomeLinks}>
          <Link
            className={styles.linkSignUp}
            to="/signup"
            aria-label="Try Water Consumption Tracker"
          >
            {t('homepage.welcome.tryBtn')}
          </Link>
          <Link
            className={styles.linkSignIn}
            to="/signin"
            aria-label="Sign in to your account"
          >
            {t('homepage.welcome.signInBtn')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
