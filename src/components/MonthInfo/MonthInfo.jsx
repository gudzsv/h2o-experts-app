import Calendar from 'components/Calendar/Calendar.jsx';
import CalendarPagination from 'components/CalendarPagination/CalendarPagination.jsx';
import Chart from 'components/Chart/Chart.jsx';
import { useState } from 'react';

const MonthInfo = ({ dateForCalendar, setDateForCalendar }) => {
  const [isChart, setIsChart] = useState(false);

  const toggleChart = () => setIsChart(prevState => !prevState);

  return (
    <div>
      <CalendarPagination
        toggleChart={toggleChart}
        isChart={isChart}
        dateForCalendar={dateForCalendar}
        setDateForCalendar={setDateForCalendar}
      />
      {isChart ? (
        <Chart />
      ) : (
        <Calendar
          dateForCalendar={dateForCalendar}
          setDateForCalendar={setDateForCalendar}
        />
      )}
    </div>
  );
};

export default MonthInfo;
