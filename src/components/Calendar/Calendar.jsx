import CalendarItem from 'components/CalendarItem/CalendarItem';
import css from './Calendar.module.css';

const Calendar = ({ dateForCalendar, getDaysInMonth, setDateForCalendar }) => {
  const amountOfDays = getDaysInMonth(dateForCalendar);

  const YEAR = dateForCalendar.getFullYear();
  let MONTH = dateForCalendar.getMonth() + 1;
  if (MONTH < 10) {
    MONTH = `0${MONTH}`;
  }
  console.log(`${YEAR}-${MONTH}`);

  return (
    <ul className={css.calendar}>
      {Array.from({ length: amountOfDays }, (_, i) => (
        <li key={i} onClick={() => setDateForCalendar(i + 1)}>
          <CalendarItem day={i} procNumberForBeauty={100} />
        </li>
      ))}
    </ul>
  );
};

export default Calendar;
