import AddWaterBtn from '../AddWaterBtn/AddWaterBtn.jsx';
import css from './WaterMainInfo.module.css';
import Logo from '../Logo/Logo.jsx';
import WaterDailyNorma from '../WaterDailyNorma/WaterDailyNorma.jsx';
import WaterProgressBar from '../WaterProgressBar/WaterProgressBar.jsx';
import { ModalTemplate } from 'components/Modal/Modal.jsx';
import WaterModal from 'components/WaterModal/WaterModal.jsx';
import { useState } from 'react';

export default function WaterMainInfo() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <section className={css.trackerSection}>
      <Logo />

      <WaterDailyNorma />
      <WaterProgressBar />

      <AddWaterBtn
        btnType="primary"
        isAbsolute={true}
        onOpenModel={handleOpenModal}
      />

      <ModalTemplate modalIsOpen={isModalOpen} closeModal={handleCloseModal}>
        <WaterModal actionType="add" />
      </ModalTemplate>
    </section>
  );
}
