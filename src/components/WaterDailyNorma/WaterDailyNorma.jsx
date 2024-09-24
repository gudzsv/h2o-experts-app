import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import css from './WaterDailyNorma.module.css';
import { DEFAULT_DAILY_NORMA } from '../../constants/constants.js';
import { currentUser } from '../../redux/auth/operations';

export default function WaterDailyNorma() {
  const dispatch = useDispatch();
  const [dailyNorm, setDailyNorm] = useState(DEFAULT_DAILY_NORMA);

  useEffect(() => {
    const loadUserData = () => {
      dispatch(currentUser()).then(action => {
        if (
          action.meta.requestStatus === 'fulfilled' &&
          action.payload?.data?.dailyRequirement
        ) {
          setDailyNorm(action.payload.data.dailyRequirement);
        } else {
          console.error(
            'Failed to load user data or dailyRequirement is missing.'
          );
        }
      });
    };

    loadUserData();
  }, [dispatch]);

  console.log('waterDailyNorma:', dailyNorm);

  return (
    <div className={css.container}>
      <p className={css.norma}>{dailyNorm} L</p>
      <p className={css.text}>My daily norma</p>
    </div>
  );
}
