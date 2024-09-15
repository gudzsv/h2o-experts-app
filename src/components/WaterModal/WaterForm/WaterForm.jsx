import { useState } from 'react';
import styles from './WaterForm.module.css';

const WaterForm = ({ edit, add, value = 50 }) => {
  const [countWater, setCountWater] = useState(value);

  const plusWater = () => {
    setCountWater(countWater + 50);
  };

  const minusWater = () => {
    if (countWater <= 0) {
      return;
    }
    setCountWater(countWater - 50);
  };

  return (
    <>
      {edit ? (
        <h2 className={styles.secondTitle}>Correct entered data:</h2>
      ) : add ? (
        <h2 className={styles.secondTitle}>Choose a value:</h2>
      ) : (
        <h2 className={styles.secondTitle}>
          Default text if neither add nor edit is true
        </h2>
      )}

      <h2 className={styles.secondTitleRegular}>Amount of water:</h2>

      <div className={styles.container}>
        <svg
          onClick={minusWater}
          className={`${styles.icon} ${countWater <= 0 ? styles.disabled : ''}`}
          width="43"
          height="43"
        >
          <use href="/src/assets/icons/sprite.svg#icon-minus-btn"></use>
        </svg>
        <p className={styles.ml}>{countWater} ml</p>
        <svg onClick={plusWater} className={styles.icon} width="43" height="43">
          <use href="/src/assets/icons/sprite.svg#icon-plus-btn"></use>
        </svg>
      </div>
    </>
  );
};

export default WaterForm;
