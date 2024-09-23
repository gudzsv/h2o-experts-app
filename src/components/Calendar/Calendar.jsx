import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CalendarItem from 'components/CalendarItem/CalendarItem';
import css from './Calendar.module.css';

import { getMonthWater } from '../../redux/water/operations.js';
import { selectMonthWater } from '../../redux/water/selectors.js';
import { DEFAULT_DAILY_NORMA } from '../../constants/constants.js';
import { selectUser } from '../../redux/auth/selectors.js';

const Calendar = ({ dateForCalendar, setDateForCalendar }) => {
  const [today, setToday] = useState(() => new Date().getDate());

  const waterDailyNormaBar = useSelector(selectUser);
  const getWater = useSelector(selectMonthWater);

  const dispatch = useDispatch();

  const amountOfDays = useMemo(() => {
    return new Date(
      dateForCalendar.getFullYear(),
      dateForCalendar.getMonth() + 1,
      0
    ).getDate();
  }, [dateForCalendar]);

  const waterDailyNorma = waterDailyNormaBar?.dailyNorma ?? DEFAULT_DAILY_NORMA;

  const ideaAmountOfWater = useMemo(
    () => waterDailyNorma * 1000,
    [waterDailyNorma]
  );

  useEffect(() => {
    const YEAR = dateForCalendar.getFullYear();
    let MONTH = dateForCalendar.getMonth() + 1;
    if (MONTH < 10) {
      MONTH = `0${MONTH}`;
    }
    dispatch(getMonthWater(`${YEAR}-${MONTH}`));
  }, [dispatch, dateForCalendar]);

  const waterDataByDay = useMemo(() => {
    return Array.from({ length: amountOfDays }, (_, i) => {
      let sumOfWater = 0;
      getWater.forEach(entry => {
        const dayOfDrinking = new Date(entry.drinkingTime).getDate();
        if (i + 1 === dayOfDrinking) {
          sumOfWater += entry.usedWater;
        }
      });
      const calcWaterProc = ((sumOfWater / ideaAmountOfWater) * 100).toFixed(2);
      return calcWaterProc;
    });
  }, [getWater, amountOfDays, ideaAmountOfWater]);

  const handleCalendarChange = day => {
    const selectedDate = new Date(
      dateForCalendar.getFullYear(),
      dateForCalendar.getMonth(),
      day
    );
    setDateForCalendar(selectedDate);
    setToday(day);
  };

  return (
    <ul className={css.calendar}>
      {Array.from({ length: amountOfDays }, (_, i) => {
        const isToday = today === i + 1;
        return (
          <li key={i} onClick={() => handleCalendarChange(i + 1)}>
            <CalendarItem
              day={i + 1}
              procNumber={waterDataByDay[i]}
              isToday={isToday}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default Calendar;
