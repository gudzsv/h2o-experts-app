import css from './CalendarPagination.module.css';
const CalendarPagination = () => {
  return (
    <div className={css.calender_pag_div}>
      <h2>Month</h2>
      <div className={css.pag_element}>
        <button className={css.button_back_month}>back</button>

        <button className={css.button_next_month}>next</button>
      </div>
    </div>
  );
};

export default CalendarPagination;
