import css from './CalendarItem.module.css';

const CalendarItem = ({ day, procNumberForBeauty }) => {
  return (
    <div className={css.calendar_items}>
      <button className={css.button_day}>{day + 1}</button>
      <p className={css.proc_number}>{procNumberForBeauty}%</p>
    </div>
  );
};

export default CalendarItem;
