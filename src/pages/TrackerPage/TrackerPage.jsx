import Calendar from 'components/Calendar/Calendar';
import CalendarPagination from 'components/CalendarPagination/CalendarPagination';
import { useState } from 'react';

const TrackerPage = () => {
  const [dateForCalendar, setDateForCalendar] = useState(() => {
    return new Date();
  });

  function getDaysInMonth(date) {
    return new Date(date.getYear(), date.getMonth() + 1, 0).getDate();
  }

  const handlePreviousMonth = () => {
    setDateForCalendar(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);

      return newDate;
    });
  };

  const handleNextMonth = () => {
    setDateForCalendar(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);

      return newDate;
    });
  };

  return (
    <div>
      <CalendarPagination
        dateForCalendar={dateForCalendar}
        handlePreviousMonth={handlePreviousMonth}
        handleNextMonth={handleNextMonth}
      />
      <Calendar
        dateForCalendar={dateForCalendar}
        getDaysInMonth={getDaysInMonth}
      />
    </div>
  );
};
export default TrackerPage;
