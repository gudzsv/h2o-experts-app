import css from './CalendarPagination.module.css';
const CalendarPagination = ({
  dateForCalendar,
  handlePreviousMonth,
  handleNextMonth,
}) => {
  const formattedMonth = new Date(dateForCalendar).toLocaleString('en-US', {
    month: 'long',
  });

  const formattedYear = new Date(dateForCalendar).toLocaleString('en-US', {
    year: 'numeric',
  });

  return (
    <div className={[css.calender_pag_div]}>
      <h2 className={css.word_month}>Month</h2>

      <div className={css.pag_element}>
        <button className={css.button_back_month} onClick={handlePreviousMonth}>
          <svg className={css.icon_arrow_calendar_left}>
            <use href="/src/assets/icons/sprite.svg#icon-chevron-down" />
          </svg>
        </button>

        <span className={css.current_month_year}>
          {formattedMonth}, {formattedYear}
        </span>

        <button className={css.button_next_month} onClick={handleNextMonth}>
          <svg className={css.icon_arrow_calendar_right}>
            <use href="/src/assets/icons/sprite.svg#icon-chevron-down" />
          </svg>
        </button>

        <button className={css.show_info_button}>
          <svg className={css.icon_pie_chart}>
            <use href="/src/assets/icons/sprite.svg#icon-pie-chart" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CalendarPagination;
