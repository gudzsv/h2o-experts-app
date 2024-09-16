import css from './AddWaterBtnDayliInfo.module.css';

const AddWaterBtnDayliInfo = ({ openModal }) => {
  return (
    <div>
      <button onClick={openModal} className={css.add_button}>
        <div className={css.wrapper}>
          <svg width="30" height="30" className={css.icon}>
            <use href="/src/assets/icons/sprite.svg#icon-plus-btn"></use>
          </svg>
          <p>Add Water</p>
        </div>
      </button>
      {/* {modalOpen && <WaterModal closeModal={() => setModalOpen(false)} />} */}
    </div>
  );
};
export default AddWaterBtnDayliInfo;
