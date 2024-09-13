import CalendarPagination from 'components/CalendarPagination/CalendarPagination';
import { useState } from 'react';

const TrackerPage = () => {
  const [dateForCalendar, setDateForCalendar] = useState(() => {
    return new Date();
  });

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
    </div>
  );
};
export default TrackerPage;
