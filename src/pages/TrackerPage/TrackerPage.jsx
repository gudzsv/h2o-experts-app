import Calendar from 'components/Calendar/Calendar';
import CalendarPagination from 'components/CalendarPagination/CalendarPagination';
import { useState } from 'react';

import css from './TrackerPage.module.css';

const TrackerPage = () => {
  const [calendarDate, setCalendarDate] = useState(() => {
    return new Date();
  });

  function getDaysInMonth(date) {
    return new Date(date.getYear(), date.getMonth() + 1, 0).getDate();
  }

  const handlePreviousMonth = () => {
    setCalendarDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);

      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCalendarDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);

      return newDate;
    });
  };

  return (
    <div className={css.div_for_calendar_things}>
      <CalendarPagination
        calendarDate={calendarDate}
        handlePreviousMonth={handlePreviousMonth}
        handleNextMonth={handleNextMonth}
      />
      <Calendar calendarDate={calendarDate} getDaysInMonth={getDaysInMonth} />
    </div>
  );
};
export default TrackerPage;
