import Logo from 'components/Logo/Logo';
import SignUpForm from 'components/SignUpForm/SignUpForm';
import { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import styles from './SignUpPage.module.css';
// import useMedia from '../../hooks/useMedia';
// import AdvantagesSection from 'components/AdvantagesSection/AdvantagesSection';

const SignUpPage = () => {
  // const { isDesktop } = useMedia();

  return (
    <>
      <Toaster />
      <div className={styles.container}>
        <section className={styles.formSection}>
          <Logo />
          <h2 className={styles.title}>Sign Up</h2>
          <SignUpForm />
          <p className={styles.wrapperText}>
            <span className={styles.text}>Already have account?</span>
            <Link to="/signin" className={styles.link}>
              Sign In
            </Link>
          </p>
        </section>
        {/* {isDesktop && <AdvantagesSection />} */}
      </div>
    </>
  );
};
export default SignUpPage;
