import Logo from 'components/Logo/Logo';
import SignUpForm from 'components/SignUpForm/SignUpForm';
import { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import styles from './SignUpPage.module.css';
import useMedia from '../../hooks/useMedia';
import AdvantagesSection from 'components/AdvantagesSection/AdvantagesSection';

const SignUpPage = () => {
  const { isDesktop } = useMedia();

  return (
    <div className={styles.container}>
      <section className={styles.formSection}>
        <Logo />
        <div className={styles.formWrapper}>
          <h2 className={styles.title} aria-label="Sign Up for an account">
            Sign Up
          </h2>
          <SignUpForm />
          <p className={styles.wrapperText}>
            <span className={styles.text}>Already have account?</span>
            <Link
              to="/signin"
              className={styles.link}
              aria-label="Go to sign in page"
            >
              Sign In
            </Link>
          </p>
        </div>
      </section>
      {isDesktop && <AdvantagesSection />}
      <Toaster />
    </div>
  );
};

export default SignUpPage;
