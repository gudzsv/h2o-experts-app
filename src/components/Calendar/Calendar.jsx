import CalendarItem from 'components/CalendarItem/CalendarItem';
import css from './Calendar.module.css';

const Calendar = ({ dateForCalendar, setDateForCalendar, currentMonth }) => {
  function getDaysInMonth(date) {
    return new Date(date.getYear(), date.getMonth() + 1, 0).getDate();
  }

  const amountOfDays = getDaysInMonth(dateForCalendar);

  function getFormattedDate(day, monthNumber) {
    const year = new Date().getFullYear();
    const date = new Date(year, monthNumber - 1, day);
    return date;
  }

  const handleCalendarChange = number => {
    const selectedDate = getFormattedDate(number, currentMonth);
    setDateForCalendar(selectedDate);
  };

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
