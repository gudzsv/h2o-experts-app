import React from 'react';

import WelcomeSection from 'components/WelcomeSection/WelcomeSection';

import AdvantagesSection from 'components/AdvantagesSection/AdvantagesSection';

import css from './HomePage.module.css';

const HomePage = () => {
  return (
    <div className={css.homesection}>
      <WelcomeSection />
      <AdvantagesSection />
    </div>
  );
};

export default HomePage;
