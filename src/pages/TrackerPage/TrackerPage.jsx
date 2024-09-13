import CalendarPagination from 'components/CalendarPagination/CalendarPagination';
import { useState } from 'react';

const TrackerPage = () => {
  const [dateForCalendar, setDateForCalendar] = useState(() => {
    return new Date();
  });

  return (
    <div>
      <CalendarPagination dateForCalendar={dateForCalendar} />
    </div>
  );
};
export default TrackerPage;
