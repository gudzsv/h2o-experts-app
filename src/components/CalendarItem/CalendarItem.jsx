import clsx from 'clsx';
import css from './CalendarItem.module.css';

const CalendarItem = ({ day, procNumber, isToday }) => {
  const percent = Math.min(procNumber, 100);

  const buttonWaterClass = clsx(
    css.button_day,
    percent === 100 ? css.water_full : css.water_not_full,
    isToday && css.today_day
  );

  return (
    <div className={css.calendar_items}>
      <button
        className={buttonWaterClass}
        aria-label={`Day ${day}, water progress ${percent}%`}
      >
        {day}
      </button>
      <p className={css.proc_number}>{percent}%</p>
    </div>
  );
};

export default CalendarItem;
