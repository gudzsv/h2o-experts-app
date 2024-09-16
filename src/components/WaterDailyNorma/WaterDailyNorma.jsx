import { useSelector } from 'react-redux';
import css from './WaterDailyNorma.module.css';
import { selectUser } from '../../redux/auth/selectors';
import { DEFAULT_DAILY_NORMA } from 'constatnts/constants.js';

export default function WaterDailyNorma() {
  // Отримання даних користувача з src/redux/water/selectors.js за допомогою селектора selectUser
  let waterDailyNormaBar = useSelector(selectUser);
  // Очікувані дані: об'єкт користувача, який містить інформацію про dailyNorma (щоденна норма води користувача)

  // Якщо dailyNorma існує, використовуємо її, якщо ні, ставимо значення за замовчуванням 1.5 літра
  let waterDailyNorma = waterDailyNormaBar?.dailyNorma ?? DEFAULT_DAILY_NORMA;

  return (
    <div className={css.container}>
      <p className={css.norma}>{waterDailyNorma}L</p>
      <p className={css.text}>My daily norma</p>
    </div>
  );
}
