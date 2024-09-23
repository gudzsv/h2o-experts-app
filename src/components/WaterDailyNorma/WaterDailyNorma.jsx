import { useSelector } from 'react-redux';
import css from './WaterDailyNorma.module.css';
import { selectUser } from '../../redux/auth/selectors.js';
import { DEFAULT_DAILY_NORMA } from '../../constants/constants.js';

export default function WaterDailyNorma() {
  let waterDailyNormaBar = useSelector(selectUser);

  let waterDailyNorma = waterDailyNormaBar?.dailyNorma ?? DEFAULT_DAILY_NORMA;

  return (
    <div className={css.container}>
      <p className={css.norma}>{waterDailyNorma} L</p>
      <p className={css.text}>My daily norma</p>
    </div>
  );
}
