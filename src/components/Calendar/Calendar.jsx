import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import CalendarItem from 'components/CalendarItem/CalendarItem';
import css from './Calendar.module.css';

import { selectMonthWater } from '../../redux/water/selectors.js';
import { DEFAULT_DAILY_NORMA } from '../../constants/constants.js';
import { selectUser } from '../../redux/auth/selectors.js';
import { getEntryDateKey, toMonthKey } from '../../helpers/date.js';

const Calendar = ({ dateForCalendar, setDateForCalendar }) => {
  const user = useSelector(selectUser);
  const getWater = useSelector(selectMonthWater);

  const monthKey = toMonthKey(dateForCalendar);
  const selectedDay = dateForCalendar.getDate();

  const amountOfDays = useMemo(() => {
    return new Date(
      dateForCalendar.getFullYear(),
      dateForCalendar.getMonth() + 1,
      0
    ).getDate();
  }, [dateForCalendar]);

  const waterDailyNorma = user?.dailyRequirement || DEFAULT_DAILY_NORMA;

  const waterDataByDay = useMemo(() => {
    const sumByDate = new Map();
    getWater.forEach(entry => {
      const dateKey = getEntryDateKey(entry);
      sumByDate.set(dateKey, (sumByDate.get(dateKey) ?? 0) + entry.usedWater);
    });

    return Array.from({ length: amountOfDays }, (_, i) => {
      const dateKey = `${monthKey}-${String(i + 1).padStart(2, '0')}`;
      const sumOfWater = sumByDate.get(dateKey) ?? 0;

      return Math.min(Math.round((sumOfWater / waterDailyNorma) * 100), 100);
    });
  }, [getWater, amountOfDays, monthKey, waterDailyNorma]);

  const handleCalendarChange = day => {
    setDateForCalendar(
      new Date(dateForCalendar.getFullYear(), dateForCalendar.getMonth(), day)
    );
  };

  return (
    <ul className={css.calendar}>
      {Array.from({ length: amountOfDays }, (_, i) => (
        <li key={i} onClick={() => handleCalendarChange(i + 1)}>
          <CalendarItem
            day={i + 1}
            procNumber={waterDataByDay[i]}
            isToday={selectedDay === i + 1}
          />
        </li>
      ))}
    </ul>
  );
};

export default Calendar;
