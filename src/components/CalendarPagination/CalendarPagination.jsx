import css from './CalendarPagination.module.css';
const CalendarPagination = ({ dateForCalendar }) => {
  const formattedDate = new Date(dateForCalendar).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className={css.calender_pag_div}>
      <h2 className={css.word_month}>Month</h2>
      <div className={css.pag_element}>
        <button className={css.button_back_month}>
          <svg className={css.icon_arrow_calendar_left} width="16" height="16">
            <use href="/src/assets/icons/sprite.svg#icon-chevron-down" />
          </svg>
        </button>

        <span className={css.current_month_year}>{formattedDate}</span>

        <button className={css.button_next_month}>
          <svg className={css.icon_arrow_calendar_right} width="16" height="16">
            <use href="/src/assets/icons/sprite.svg#icon-chevron-down" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CalendarPagination;
