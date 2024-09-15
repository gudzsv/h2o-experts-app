import Logo from 'components/Logo/Logo';
import SignInForm from 'components/SignInForm/SignInForm';
import { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import styles from './SignInPage.module.css';
import useMedia from '../../hooks/useMedia';
import AdvantagesSection from 'components/AdvantagesSection/AdvantagesSection';

const SignInPage = () => {
  const { isDesktop } = useMedia();

  return (
    <div className={styles.container}>
      <section className={styles.formSection}>
        <Logo />
        <div className={styles.formWrapper}>
          <h2 className={styles.title} aria-label="Sign Up for an account">
            Sign In
          </h2>
          <SignInForm />
          <p className={styles.wrapperText}>
            <span className={styles.text}>Don’t have an account?</span>
            <Link
              to="/signup"
              className={styles.link}
              aria-label="Go to sign up page"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </section>
      {isDesktop && <AdvantagesSection />}
      <Toaster />
    </div>
  );
};

export default SignInPage;
