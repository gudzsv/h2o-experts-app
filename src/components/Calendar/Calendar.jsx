import CalendarItem from 'components/CalendarItem/CalendarItem';
import css from './Calendar.module.css';

const Calendar = ({ calendarDate, getDaysInMonth }) => {
  const amountOfDays = getDaysInMonth(calendarDate);

  return (
    <ul className={css.calendar}>
      {Array.from({ length: amountOfDays }, (_, i) => (
        <li key={i}>
          <CalendarItem day={i} procNumberForBeauty={100} />
        </li>
      ))}
    </ul>
  );
};

export default Calendar;
