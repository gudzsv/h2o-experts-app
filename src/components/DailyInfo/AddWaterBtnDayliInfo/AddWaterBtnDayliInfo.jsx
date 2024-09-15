import WaterModal from 'components/WaterModal/WaterModal';
import { useState } from 'react';
import css from './AddWaterBtnDayliInfo.module.css';

const AddWaterBtnDayliInfo = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setModalOpen(true)} className={css.button}>
        <div className={css.wrapper}>
          <svg width="30" height="30" className={css.icon}>
            <use href="/src/assets/icons/sprite.svg#icon-plus-btn"></use>
          </svg>
          {'Add Water'}
        </div>
      </button>
      {modalOpen && <WaterModal closeModal={() => setModalOpen(false)} />}
    </div>
  );
};
export default AddWaterBtnDayliInfo;
