import UserPanel from '../UserPanel/UserPanel.jsx';
import DailyInfo from '../DailyInfo/DailyInfo.jsx';
import MonthInfo from '../MonthInfo/MonthInfo.jsx';
import css from '../WaterDetailedInfo/WaterDetailedInfo.module.css';

import { useState } from 'react';

export default function WaterDetailedInfo() {
  const [dateForCalendar, setDateForCalendar] = useState(() => {
    return new Date();
  });
  return (
    <section className={css.container}>
      <UserPanel />
      <DailyInfo dateForCalendar={dateForCalendar} />
      <MonthInfo
        dateForCalendar={dateForCalendar}
        setDateForCalendar={setDateForCalendar}
      />
    </section>
  );
}
