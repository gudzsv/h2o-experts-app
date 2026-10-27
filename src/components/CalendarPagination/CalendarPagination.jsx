import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import css from './CalendarPagination.module.css';
import sprite from '../../assets/icons/sprite.svg';
import { addMonths, subMonths } from 'date-fns';

const CalendarPagination = ({
  toggleChart,
  isChart,
  dateForCalendar,
  setDateForCalendar,
}) => {
  const { t } = useTranslation();

  const formattedMonth = useMemo(() => {
    const month = new Date(dateForCalendar).toLocaleString('en-US', {
      month: 'long',
    });

    return t(`months.${month}`);
  }, [dateForCalendar, t]);

  const formattedYear = useMemo(
    () =>
      new Date(dateForCalendar).toLocaleString('en-US', { year: 'numeric' }),
    [dateForCalendar]
  );

  const handlePreviousMonth = useCallback(() => {
    setDateForCalendar(prevDate => subMonths(prevDate, 1));
  }, [setDateForCalendar]);

  const handleNextMonth = useCallback(() => {
    setDateForCalendar(prevDate => addMonths(prevDate, 1));
  }, [setDateForCalendar]);

  return (
    <div className={css.calender_pag_div}>
      <h2 className={css.word_month}>
        {isChart ? t('calendar.statistics') : t('calendar.month')}
      </h2>

      <div className={css.pag_element}>
        <button
          className={css.button_back_month}
          onClick={handlePreviousMonth}
          aria-label={t('calendar.previousMonth')}
        >
          <svg className={css.icon_arrow_calendar_left}>
            <use href={`${sprite}#icon-chevron-down`}></use>
          </svg>
        </button>

        <span className={css.current_month_year}>
          {formattedMonth}, {formattedYear}
        </span>

        <button
          className={css.button_next_month}
          onClick={handleNextMonth}
          aria-label={t('calendar.nextMonth')}
        >
          <svg className={css.icon_arrow_calendar_right}>
            <use href={`${sprite}#icon-chevron-down`}></use>
          </svg>
        </button>

        <button
          className={css.show_info_button}
          onClick={toggleChart}
          aria-label={
            isChart ? t('calendar.hideChart') : t('calendar.showChart')
          }
        >
          <svg className={css.icon_pie_chart}>
            <use href={`${sprite}#icon-pie-chart`}></use>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CalendarPagination;
