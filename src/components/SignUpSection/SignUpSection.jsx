import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from 'components/Logo/Logo';
import SignUpForm from 'components/SignUpForm/SignUpForm';
import styles from './SignUpSection.module.css';

const SignUpSection = () => {
  const { t } = useTranslation();
  return (
    <section className={styles.formSection}>
      <Logo />
      <div className={styles.formWrapper}>
        <h2 className={styles.title} aria-label="Sign Up for an account">
          {t('signUp.title')}
        </h2>
        <SignUpForm />
        <p className={styles.wrapperText}>
          <span className={styles.text}>{t('signUp.account')}</span>
          <Link
            to="/signin"
            className={styles.link}
            aria-label="Go to sign in page"
          >
            {t('signUp.signIn')}
          </Link>
        </p>
      </div>
    </section>
  );
};

export default SignUpSection;
