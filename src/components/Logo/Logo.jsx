import { Link } from 'react-router-dom';
import styles from './Logo.module.css';
import LanguageSwitcher from 'components/LanguageSwitcher/LanguageSwitcher.jsx';

const Logo = () => {
  return (
    <div className={styles.logoLanguageWrapper}>
      <Link to="/" className={styles.logo} alt="Water Consumption Tracker Logo">
        AquaTrack
      </Link>
      <LanguageSwitcher />
    </div>
  );
};

export default Logo;
