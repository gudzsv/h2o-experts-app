import { useState } from 'react';
import css from './AddWaterBtn.module.css';
import Icons from '../../assets/icons/sprite.svg';
import WaterModal from '../WaterModal/WaterModal';
import { selectDate } from '../../redux/water/selectors';
import { useSelector } from 'react-redux';
import { isToday, parseISO } from 'date-fns';

export default function AddWaterBtn({ mainColor, colorText, colorIcon }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Отримання обраної дати з src/redux/water/selectors.js за допомогою селектора selectDate
  const selectedData = useSelector(selectDate); // Очікується дата у форматі ISO-строки зі стану water

  const parsedDate = parseISO(selectedData);

  const isTodayData = isToday(parsedDate);

  return (
    <>
      <button
        className={css.wrapper}
        style={{ backgroundColor: mainColor }}
        onClick={openModal}
        disabled={!isTodayData}
        aria-disabled={!isTodayData}
        aria-label="Add water button"
      >
        <div
          className={
            !isTodayData ? css.add_water_btn_disabled : css.add_water_btn
          }
          style={{ color: colorText }}
        >
          <svg className={css.icon} stroke={colorIcon}>
            <use href={Icons + '#icon-x'}></use>
          </svg>
          <span className={css.text}>Add water</span>
        </div>
      </button>

      {isModalOpen && <WaterModal operationType="add" onClose={closeModal} />}
    </>
  );
}
