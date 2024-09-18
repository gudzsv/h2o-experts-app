import DailyInfo from 'components/DailyInfo/DailyInfo';
import Calendar from 'components/Calendar/Calendar';
import CalendarPagination from 'components/CalendarPagination/CalendarPagination';

import { useState } from 'react';
import css from './TrackerPage.module.css';

const TrackerPage = () => {
  const [dateForCalendar, setDateForCalendar] = useState(() => {
    return new Date();
  });

  return (
    <div className={css.div_for_calendar_things}>
      <DailyInfo dateForCalendar={dateForCalendar} />
      <CalendarPagination
        dateForCalendar={dateForCalendar}
        setDateForCalendar={setDateForCalendar}
      />
      <Calendar
        dateForCalendar={dateForCalendar}
        setDateForCalendar={setDateForCalendar}
      />
    </div>
  );
};
export default TrackerPage;
