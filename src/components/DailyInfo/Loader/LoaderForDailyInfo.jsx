import { BallTriangle } from 'react-loader-spinner';
import styles from './LoaderForDailyInfo.module.css';

const BallTriangleLoader = () => (
  <div className={styles.dailyInfoLoader}>
    <BallTriangle height={80} width={80} ariaLabel="loading" />
  </div>
);

export default BallTriangleLoader;
