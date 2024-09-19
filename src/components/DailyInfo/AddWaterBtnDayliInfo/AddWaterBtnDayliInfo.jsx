import css from './AddWaterBtnDayliInfo.module.css';
import sprite from '../../../assets/icons/sprite.svg';

const AddWaterBtnDayliInfo = ({ onIsAdd }) => {
  return (
    <div>
      <button onClick={onIsAdd} className={css.add_button}>
        <div className={css.wrapper}>
          <svg width="30" height="30" className={css.icon}>
            <use href={`${sprite}#icon-plus-btn`}></use>
          </svg>
          <p>Add Water</p>
        </div>
      </button>
      {/* {modalOpen && <WaterModal closeModal={() => setModalOpen(false)} />} */}
    </div>
  );
};
export default AddWaterBtnDayliInfo;
