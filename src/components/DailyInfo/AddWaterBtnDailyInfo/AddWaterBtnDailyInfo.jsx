import css from './AddWaterBtnDailyInfo.module.css';
import sprite from '../../../assets/icons/sprite.svg';

const AddWaterBtnDailyInfo = ({ onIsAdd }) => {
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

export default AddWaterBtnDailyInfo;
