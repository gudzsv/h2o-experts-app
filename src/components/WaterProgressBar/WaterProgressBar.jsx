import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../redux/auth/selectors';
import { selectDayWater } from '../../redux/water/selectors';
import { getDayWater } from '../../redux/water/operations';
import css from './WaterProgressBar.module.css';
import { DEFAULT_DAILY_NORMA } from '../../constants/constants.js';

export default function WaterProgressBar() {
  const dispatch = useDispatch();
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    dispatch(getDayWater(today));
  }, [dispatch, today]);

  const dayWater = useSelector(selectDayWater);
  const user = useSelector(selectUser);

  const waterDailyNorma = user?.dailyRequirement || DEFAULT_DAILY_NORMA;

  let amount = 0;
  if (dayWater && dayWater.length > 0) {
    amount = dayWater.reduce((total, item) => total + item.usedWater, 0);
  }

  const percentDaily = Math.min(
    Math.round((amount / waterDailyNorma) * 100),
    100
  );

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
          style={{ width: `${percentDaily}%` }}
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
              {percentDaily}%
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
