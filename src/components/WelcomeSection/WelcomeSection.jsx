import Logo from '../Logo/Logo';
import css from './WelcomeSection.module.css';
import { Link } from 'react-router-dom';

const WelcomeSection = () => {
  return (
    <section className={css.welcomeSection} aria-labelledby="welcome-heading">
      <Logo className={css.welcomeLogo} />
      <div className={css.welcomeContainer}>
        <p>Record daily water intake and track</p>
        <h1>
          <span>Water</span>
          <span>consumption</span>
          <span>tracker</span>
        </h1>

        <div className={css.links}>
          <Link
            className={css.linkSignUp}
            to="/signup"
            aria-label="Try Water Consumption Tracker"
          >
            Try Tracker
          </Link>
          <Link
            className={css.linkSignIn}
            to="/signin"
            aria-label="Sign in to your account"
          >
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
