import React from 'react';

import Logo from '../Logo/Logo';

import css from './WelcomeSection.module.css';
import { Link } from 'react-router-dom';

const WelcomeSection = () => {
  return (
    <div className={css.welcomesection}>
      <Logo className={css.welcomelogo} />
      <div className={css.welcomecontainer}>
        <h2>Record daily water intake and track</h2>
        <h1>
          <span>Water</span>
          <span>consumption</span>
          <span>tracker</span>
        </h1>

        <div className={css.links}>
          <Link className={css.linksignup} to="/signup">
            Try Tracker
          </Link>
          <Link className={css.linksignin} to="/signin">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
