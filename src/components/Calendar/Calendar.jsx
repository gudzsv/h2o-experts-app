import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CalendarItem from 'components/CalendarItem/CalendarItem';
import css from './Calendar.module.css';

import { getMonthWater } from '../../redux/water/operations.js';
import { selectMonthWater } from '../../redux/water/selectors.js';

import { DEFAULT_DAILY_NORMA } from '../../constants/constants.js';
import { selectUser } from '../../redux/auth/selectors.js';

const Calendar = ({ dateForCalendar, setDateForCalendar }) => {
  let waterDailyNormaBar = useSelector(selectUser);

  function getDaysInMonth(date) {
    return new Date(date.getYear(), date.getMonth() + 1, 0).getDate();
  }

  const amountOfDays = getDaysInMonth(dateForCalendar);

  function getFormattedDate(day) {
    const year = dateForCalendar.getFullYear();
    const month = dateForCalendar.getMonth();
    const date = new Date(year, month, day);

    return date;
  }

  const handleCalendarChange = number => {
    const selectedDate = getFormattedDate(number);
    setDateForCalendar(selectedDate);
  };

  const YEAR = dateForCalendar.getFullYear();
  let MONTH = dateForCalendar.getMonth() + 1;
  if (MONTH < 10) {
    MONTH = `0${MONTH}`;
  }

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMonthWater(`${YEAR}-${MONTH}`));
  }, [dispatch]);

  const getedWater = useSelector(state => selectMonthWater(state));

  return (
    <ul className={css.calendar}>
      {Array.from({ length: amountOfDays }, (_, i) => {
        let sumaOfWater = 0;

        let waterDailyNorma =
          waterDailyNormaBar?.dailyNorma ?? DEFAULT_DAILY_NORMA;

        const ideaAmountOfWater = waterDailyNorma * 1000;

        for (let j = 0; j < getedWater.length; j++) {
          const dayOfDrinking = new Date(getedWater[j].drinkingTime).getDate();

          if (i + 1 == dayOfDrinking) {
            sumaOfWater = sumaOfWater + getedWater[j].usedWater;
          }
        }

        const calcWaterProc = ((sumaOfWater / ideaAmountOfWater) * 100).toFixed(
          2
        );
        return (
          <li key={i} onClick={() => handleCalendarChange(i + 1)}>
            <CalendarItem day={i + 1} procNumber={calcWaterProc} />
          </li>
        );
      })}
    </ul>
  );
};

export default Calendar;
