import AddWaterBtn from '../AddWaterBtn/AddWaterBtn.jsx';
import css from './WaterMainInfo.module.css';
import Logo from '../Logo/Logo.jsx';
import WaterDailyNorma from '../WaterDailyNorma/WaterDailyNorma.jsx';
import WaterProgressBar from '../WaterProgressBar/WaterProgressBar.jsx';
import { useWaterModal } from 'components/WaterModal/waterModalContext.js';

export default function WaterMainInfo() {
  const { openAdd } = useWaterModal();

  return (
    <section className={css.trackerSection} data-theme="light">
      <Logo />

      <WaterDailyNorma />
      <WaterProgressBar />

      <AddWaterBtn
        btnType="primary"
        isAbsolute={true}
        onClick={() => openAdd()}
      />
    </section>
  );
}
