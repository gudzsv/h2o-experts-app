import Calendar from 'components/Calendar/Calendar.jsx';
import CalendarPagination from 'components/CalendarPagination/CalendarPagination.jsx';
import Chart from 'components/Chart/Chart.jsx';

const MonthInfo = ({ dateForCalendar, setDateForCalendar }) => {
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
