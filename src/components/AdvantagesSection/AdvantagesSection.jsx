import { Trans } from 'react-i18next';
import styles from './AdvantagesSection.module.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCounter } from '../../redux/auth/selectors.js';
import { getCounter } from '../../redux/auth/operations.js';

const AdvantagesSection = () => {
  const dispatch = useDispatch();
  const counter = useSelector(selectCounter);

  useEffect(() => {
    dispatch(getCounter());
  }, [dispatch]);

  return (
    <section className={styles.advantagesSection}>
      <button className={styles.customersButton}>
        <div className={styles.customerContainer}>
          <ul className={styles.customerIcons}>
            <li className={styles.icon1}></li>
            <li className={styles.icon2}></li>
            <li className={styles.icon3}></li>
          </ul>
          <p className={styles.customerText}>
            <Trans i18nKey="homepage.advantages.customers" values={{ counter }}>
              Our <span className={styles.accent}></span> happy customers
            </Trans>
          </p>
        </div>
      </button>
      <ul className={styles.advantages}>
        <li>
          <ul>
            <li className={styles.habitDrive}>
              <div className={styles.circle}></div>
              <Trans i18nKey="homepage.advantages.habitDrive" />
            </li>
            <li className={styles.viewStatistic}>
              <Trans i18nKey="homepage.advantages.viewStatistic" />
            </li>
          </ul>
        </li>
        <li className={styles.personalSetting}>
          <Trans i18nKey="homepage.advantages.personalSetting" />
        </li>
      </ul>
    </section>
  );
};

export default AdvantagesSection;
