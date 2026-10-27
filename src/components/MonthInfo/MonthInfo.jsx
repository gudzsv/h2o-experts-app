import Calendar from 'components/Calendar/Calendar.jsx';
import CalendarPagination from 'components/CalendarPagination/CalendarPagination.jsx';
import Chart from 'components/Chart/Chart.jsx';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getMonthWater } from '../../redux/water/operations.js';
import { toMonthKey } from '../../helpers/date.js';

const MonthInfo = ({ dateForCalendar, setDateForCalendar }) => {
  const dispatch = useDispatch();
  const [isChart, setIsChart] = useState(false);

  const monthKey = toMonthKey(dateForCalendar);

  useEffect(() => {
    dispatch(getMonthWater(monthKey));
  }, [dispatch, monthKey]);

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
