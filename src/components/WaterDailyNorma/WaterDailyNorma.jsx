import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import css from './WaterDailyNorma.module.css';
import { DEFAULT_DAILY_NORMA } from '../../constants/constants.js';
import { useVolume } from '../../hooks/useVolume.js';
import { currentUser } from '../../redux/auth/operations';
import { selectUser } from '../../redux/auth/selectors';

export default function WaterDailyNorma() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { formatNorm } = useVolume();

  useEffect(() => {
    dispatch(currentUser());
  }, [dispatch]);

  return (
    <div className={css.container}>
      <p className={css.norma}>
        {formatNorm(user?.dailyRequirement || DEFAULT_DAILY_NORMA)}
      </p>
      <p className={css.text}>{t('waterDailyNorma.dailyNorma')}</p>
    </div>
  );
}
