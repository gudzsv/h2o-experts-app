import Calendar from 'components/Calendar/Calendar.jsx';
import CalendarPagination from 'components/CalendarPagination/CalendarPagination.jsx';
import Chart from 'components/Chart/Chart.jsx';
import { useState } from 'react';

const MonthInfo = () => {
  const [dateForCalendar, setDateForCalendar] = useState(() => {
    return new Date();
  });

  return (
    <div>
      MonthInfo
      <CalendarPagination
        dateForCalendar={dateForCalendar}
        setDateForCalendar={setDateForCalendar}
      />
      <Calendar
        dateForCalendar={dateForCalendar}
        setDateForCalendar={setDateForCalendar}
      />
      <Chart />
    </div>
  );
};

export default MonthInfo;
