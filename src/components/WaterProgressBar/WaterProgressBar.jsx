import { number } from 'yup';
import { selectUser } from '../../redux/auth/selectors';
import { selectDayWater } from '../../redux/water/selectors';
import css from './WaterProgressBar.module.css';
import { useSelector } from 'react-redux';
import { DEFAULT_DAILY_NORMA } from '../../constants/constants.js';

export default function WaterProgressBar() {
  // Отримання даних користувача src/redux/auth/selectors.js за допомогою селектора selectUser
  let waterDailyNormaBar = useSelector(selectUser);
  // Очікувані дані: об'єкт користувача, який містить інформацію про dailyNorma (щоденна норма води користувача)

  let waterDailyNorma;

  const normaValidation = number().min(0).max(5).required();

  try {
    normaValidation.validateSync(
      waterDailyNormaBar?.dailyNorma || DEFAULT_DAILY_NORMA
    );
    waterDailyNorma = waterDailyNormaBar?.dailyNorma || DEFAULT_DAILY_NORMA;
  } catch (error) {
    console.error('Validation error:', error);
    waterDailyNorma = DEFAULT_DAILY_NORMA;
  }

  let amount = 0;
  // Отримання даних про кількість води з src/redux/water/selectors.js за допомогою селектора selectWaterDate
  const items = useSelector(selectDayWater);
  // Очікувані дані: масив об'єктів, що містять дані про кількість спожитої води (item.amount)

  if (items && items.length > 0) {
    amount = items.reduce((total, item) => total + item.amount, 0);
  }

  const dailyNormaMl = waterDailyNorma * 1000;

  function percentDailyCalc(waterDay, norma) {
    return Math.round((waterDay / norma) * 100);
  }

  let percentDaily = percentDailyCalc(amount, dailyNormaMl);

  if (!percentDaily || percentDaily < 0 || typeof percentDaily !== 'number') {
    percentDaily = 0;
  } else if (percentDaily > 100) {
    percentDaily = 100;
  }

  let circleRightMod = -2;

  if (percentDaily <= 2) {
    circleRightMod = -10;
  } else if (percentDaily > 2 && percentDaily < 7) {
    circleRightMod = -8;
  } else if (percentDaily >= 7 && percentDaily < 10) {
    circleRightMod = -6;
  }

  let floatPercentMod = -7;

  if (percentDaily < 4 && percentDaily >= 0) {
    floatPercentMod = -3;
  } else if (percentDaily >= 4 && percentDaily < 12) {
    floatPercentMod = -4;
  } else if (percentDaily >= 12 && percentDaily < 13) {
    floatPercentMod = -5;
  } else if (percentDaily >= 13 && percentDaily < 20) {
    floatPercentMod = -6;
  } else if (percentDaily >= 20 && percentDaily < 26) {
    floatPercentMod = -6.5;
  }

  return (
    <div className={css.container}>
      <div className={css.backBar}>
        <div
          className={css.frontBar}
          style={{
            width: `${percentDaily}%`,
          }}
          role="progressbar"
          aria-valuenow={percentDaily}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div className={css.frontBarCircle} style={{ right: circleRightMod }}>
            <div
              className={css.floatPercent}
              style={{ right: floatPercentMod }}
            >
              {Math.round(percentDaily)}%
            </div>
          </div>
        </div>
      </div>

      <ul className={css.percentage}>
        <li className={css.stablePercent}>0%</li>
        <li className={css.stablePercent}>50%</li>
        <li className={css.stablePercent}>100%</li>
      </ul>
    </div>
  );
}
