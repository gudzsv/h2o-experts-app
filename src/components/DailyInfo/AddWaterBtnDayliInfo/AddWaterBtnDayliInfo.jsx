// import React, { useState } from 'react';
// import css from './AddWaterBtnDayliInfo.module.css';
// import sprite from '../../../assets/icons/sprite.svg';
// import WaterModal from 'components/WaterModal/WaterModal';
// import { ModalTemplate } from 'components/Modal/Modal';

// const AddWaterBtnDayliInfo = ({ onIsAdd }) => {
//   const [modalOpen, setModalOpen] = useState(false); // Состояние для открытия/закрытия модального окна

//   const handleAddWaterClick = () => {
//     setModalOpen(true); // Открываем модальное окно
//     if (onIsAdd) {
//       onIsAdd(); // Вызываем переданный пропс для дополнительной логики
//     }
//   };

//   return (
//     <div>
//       <button onClick={handleAddWaterClick} className={css.add_button}>
//         <div className={css.wrapper}>
//           <svg width="30" height="30" className={css.icon}>
//             <use href={`${sprite}#icon-plus-btn`}></use>
//           </svg>
//           <p>Add Water</p>
//         </div>
//       </button>

//       {/* Используем ModalTemplate для обертки WaterModal */}
//       {modalOpen && (
//         <ModalTemplate
//           modalIsOpen={modalOpen} // Передаем состояние модального окна
//           closeModal={() => setModalOpen(false)} // Закрытие модального окна
//         >
//           <WaterModal
//             closeModal={() => setModalOpen(false)} // Закрываем модальное окно внутри WaterModal
//           />
//         </ModalTemplate>
//       )}
//     </div>
//   );
// };

// export default AddWaterBtnDayliInfo;
import css from './AddWaterBtnDayliInfo.module.css';
import sprite from '../../../assets/icons/sprite.svg';

const AddWaterBtnDayliInfo = ({ onIsAdd }) => {
  const handleAddWaterClick = () => {
    if (onIsAdd) {
      onIsAdd();
    }
  };

  return (
    <div>
      <button onClick={handleAddWaterClick} className={css.add_button}>
        <div className={css.wrapper}>
          <svg width="30" height="30" className={css.icon}>
            <use href={`${sprite}#icon-plus-btn`}></use>
          </svg>
          <p>Add Water</p>
        </div>
      </button>
    </div>
  );
};

export default AddWaterBtnDayliInfo;
