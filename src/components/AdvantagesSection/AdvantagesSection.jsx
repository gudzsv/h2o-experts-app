// import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';
import styles from './AdvantagesSection.module.css';

const AdvantagesSection = () => {
  // const { t } = useTranslation();
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
            <Trans i18nKey="homepage.advantages.customers">
              Our <span className={styles.accent}>happy</span> customers
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
