import { useState } from 'react';
import AddWaterBtn from '../AddWaterBtn/AddWaterBtn.jsx';
import css from './WaterMainInfo.module.css';
import Logo from '../Logo/Logo.jsx';
import WaterDailyNorma from '../WaterDailyNorma/WaterDailyNorma.jsx';
import WaterProgressBar from '../WaterProgressBar/WaterProgressBar.jsx';
import WaterModal from '../WaterModal/WaterModal';

import bottleDesktop1x from '../../assets/img/bottle_for_water/bottle_for_water_desktop_1x.webp';
import bottleDesktop2x from '../../assets/img/bottle_for_water/bottle_for_water_desktop_2x.webp';
import bottleMob1x from '../../assets/img/bottle_for_water/bottle_for_water_mob_1x.webp';
import bottleMob2x from '../../assets/img/bottle_for_water/bottle_for_water_mob_2x.webp';
import bottleTablet1x from '../../assets/img/bottle_for_water/bottle_for_water_tablet_1x.webp';
import bottleTablet2x from '../../assets/img/bottle_for_water/bottle_for_water_tablet_2x.webp';

export default function WaterMainInfo() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section className={css.container}>
      <div className={css.trackerLogo}>
        <Logo />
      </div>

      <img
        className={css.trackerImage}
        srcSet={`
          ${bottleMob1x} 320w, 
          ${bottleMob2x} 640w, 
          ${bottleTablet1x} 768w, 
          ${bottleTablet2x} 1536w, 
          ${bottleDesktop1x} 1440w, 
          ${bottleDesktop2x} 2880w
        `}
        sizes="(max-width: 320px) 262px, 
               (max-width: 768px) 374px, 
               (max-width: 1440px) 472px, 
               100vw"
        src={bottleMob1x}
        alt="Bottle for water"
      />

      <WaterDailyNorma />
      <WaterProgressBar />

      <div className={css.btn}>
        <AddWaterBtn openModal={openModal} />
        {isModalOpen && <WaterModal operationType="add" onClose={closeModal} />}
      </div>
    </section>
  );
}
