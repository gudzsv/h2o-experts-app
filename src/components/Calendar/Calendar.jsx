import CalendarItem from 'components/CalendarItem/CalendarItem';
import css from './Calendar.module.css';

const Calendar = ({ dateForCalendar, getDaysInMonth, setDateForCalendar }) => {
  const amountOfDays = getDaysInMonth(dateForCalendar);

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
