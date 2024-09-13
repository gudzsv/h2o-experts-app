import Logo from 'components/Logo/Logo';
import SignUpForm from 'components/SignUpForm/SignUpForm';
import { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import styles from './SignUpPage.module.css';
import AdvantagesSection from 'components/AdvantagesSection/AdvantagesSection';

const SignUpPage = () => {
  return (
    <>
      <Toaster />
      <section className={styles.formSection}>
        <Logo />
        <h2 className={styles.title}>Sign Up</h2>
        <SignUpForm />
        <p className={styles.wrapperText}>
          Already have account?
          <Link to="/signin" className={styles.link}>
            Sign In
          </Link>
        </p>
      </section>
      <AdvantagesSection />
    </>
  );
};
export default SignUpPage;
