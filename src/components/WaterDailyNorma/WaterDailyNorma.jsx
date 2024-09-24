import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import css from './WaterDailyNorma.module.css';
import { DEFAULT_DAILY_NORMA } from '../../constants/constants.js';
import { currentUser } from '../../redux/auth/operations';
import { selectUser } from '../../redux/auth/selectors';

export default function WaterDailyNorma() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [dailyNorm, setDailyNorm] = useState(DEFAULT_DAILY_NORMA / 1000);

  useEffect(() => {
    dispatch(currentUser());
  }, [dispatch]);

  useEffect(() => {
    if (user?.dailyRequirement) {
      setDailyNorm(user.dailyRequirement / 1000);
    }
  }, [user]);

  console.log('waterDailyNorma:', dailyNorm);

  return (
    <div className={css.container}>
      <p className={css.norma}>
        {dailyNorm} {t('waterDailyNorma.liters')}
      </p>
      <p className={css.text}>{t('waterDailyNorma.dailyNorma')}</p>
    </div>
  );
}
