import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './SignInSection.module.css';
import Logo from 'components/Logo/Logo';
import SignInForm from 'components/SignInForm/SignInForm';

const SignInSection = () => {
  const { t } = useTranslation();
  return (
    <section className={styles.formSection}>
      <Logo />
      <div className={styles.formWrapper}>
        <h2 className={styles.title} aria-label="Sign In for an account">
          {t('signIn.title')}
        </h2>
        <SignInForm />
        <p className={styles.wrapperText}>
          <span className={styles.text}>{t('signIn.account')}</span>
          <Link
            to="/signup"
            className={styles.link}
            aria-label="Go to sign up page"
          >
            {t('signIn.signUp')}
          </Link>
        </p>
        <p className={styles.wrapperText}>
          <Link
            to="/reset-password"
            className={styles.link}
            aria-label="Go to reset password page"
          >
            {t('signIn.forgotPassword')}
          </Link>
        </p>
      </div>
    </section>
  );
};

export default SignInSection;
