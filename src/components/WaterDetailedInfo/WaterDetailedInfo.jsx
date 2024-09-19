import UserPanel from '../UserPanel/UserPanel.jsx';
import DailyInfo from '../DailyInfo/DailyInfo.jsx';
import MonthInfo from '../MonthInfo/MonthInfo.jsx';
import css from '../WaterDetailedInfo/WaterDetailedInfo.module.css';

export default function WaterDetailedInfo() {
  return (
    <section className={css.container}>
      <UserPanel />
      <DailyInfo />
      <MonthInfo />
    </section>
  );
}
