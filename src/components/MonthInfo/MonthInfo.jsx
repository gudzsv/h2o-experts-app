import Calendar from 'components/Calendar/Calendar.jsx';
import CalendarPagination from 'components/CalendarPagination/CalendarPagination.jsx';
import { lazy, Suspense, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getMonthWater } from '../../redux/water/operations.js';
import { toMonthKey } from '../../helpers/date.js';

const Chart = lazy(() => import('components/Chart/Chart.jsx'));

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
        <Suspense fallback={null}>
          <Chart />
        </Suspense>
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
