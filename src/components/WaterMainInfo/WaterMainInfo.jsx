import AddWaterBtn from '../AddWaterBtn/AddWaterBtn.jsx';
import css from './WaterMainInfo.module.css';
import Logo from '../Logo/Logo.jsx';
import WaterDailyNorma from '../WaterDailyNorma/WaterDailyNorma.jsx';
import WaterProgressBar from '../WaterProgressBar/WaterProgressBar.jsx';

export default function WaterMainInfo() {
  return (
    <section className={css.trackerSection}>
      <Logo />

      <WaterDailyNorma />
      <WaterProgressBar />

      <AddWaterBtn type="primary" isAbsolute={true} />
    </section>
  );
}
