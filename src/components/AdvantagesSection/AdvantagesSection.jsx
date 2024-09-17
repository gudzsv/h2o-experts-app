import React from 'react';
import { useState } from 'react';

import css from './AdvantagesSection.module.css';

const AdvantagesSection = () => {
  return (
    <div className={css.advantagessection}>
      <button className={css.customersbutton}>
        <div className={css.customercontainer}>
          <div className={css.customericons}>
            <span className={css.icon1}></span>
            <span className={css.icon2}></span>
            <span className={css.icon3}></span>
          </div>
          <div className={css.customertext}>
            Our <span className={css.accent}>happy</span> customers
          </div>
        </div>
      </button>
      <div className={css.advantages}>
        <button className={css.habitdrive}>
          <div className={css.circle}></div>
          Habit drive
        </button>

        <button className={css.viewstatistic}>View statistics</button>
        <button className={css.pesonalsetting}>Personal rate setting</button>
      </div>
    </div>
  );
};

export default AdvantagesSection;
