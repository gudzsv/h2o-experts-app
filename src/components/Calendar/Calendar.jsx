import CalendarItem from 'components/CalendarItem/CalendarItem';
import css from './Calendar.module.css';

import { getMonthWater } from 'src/redux/water/operations.js';
import { selectMonthWater } from 'src/redux/water/selectors.js';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';

const Calendar = ({ dateForCalendar, setDateForCalendar }) => {
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

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMonthWater('2024-09'));
  }, [dispatch]);

  const gete = useSelector(state => selectMonthWater(state));
  console.log(gete);

  return (
    <ul className={css.calendar}>
      {Array.from({ length: amountOfDays }, (_, i) => (
        <li key={i} onClick={() => handleCalendarChange(i + 1)}>
          <CalendarItem day={i} procNumberForBeauty={100} />
        </li>
      ))}
    </ul>
  );
};

export default Calendar;
