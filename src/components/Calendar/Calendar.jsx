import css from './Calendar.module.css';

const Calendar = ({ dateForCalendar, getDaysInMonth }) => {
  const amountOfDays = getDaysInMonth(dateForCalendar);

  return (
    <ul className={css.calendar}>
      {Array.from({ length: amountOfDays }, (_, i) => (
        <li key={i}>
          <button className={css.button_day}>{i + 1}</button>
        </li>
      ))}
    </ul>
  );
};

export default Calendar;
