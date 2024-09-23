import clsx from 'clsx';
import css from './CalendarItem.module.css';

const CalendarItem = ({ day, procNumber, isToday }) => {
  let procent;
  if (procNumber > 100) {
    procent = 100;
  } else {
    procent = procNumber;
  }

  const button_water = clsx(
    css.button_day,
    procent == 100 && css.water_full,
    procent < 100 && css.water_not_full,
    isToday && css.today_day
  );

  return (
    <div className={css.calendar_items}>
      <button className={button_water}>{day}</button>
      <p className={css.proc_number}>{procent}%</p>
    </div>
  );
};

export default CalendarItem;
