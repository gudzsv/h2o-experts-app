import css from './AdvantagesSection.module.css';

const AdvantagesSection = () => {
  return (
    <section className={css.advantagesSection}>
      <button className={css.customersButton}>
        <div className={css.customerContainer}>
          <ul className={css.customerIcons}>
            <li className={css.icon1}></li>
            <li className={css.icon2}></li>
            <li className={css.icon3}></li>
          </ul>
          <p className={css.customerText}>
            Our <span className={css.accent}>happy</span> customers
          </p>
        </div>
      </button>
      <ul className={css.advantages}>
        <li className={css.habitDrive}>
          <div className={css.circle}></div>
          Habit drive
        </li>
        <li className={css.viewStatistic}>View statistics</li>
        <li className={css.personalSetting}>Personal rate setting</li>
      </ul>
    </section>
  );
};

export default AdvantagesSection;
