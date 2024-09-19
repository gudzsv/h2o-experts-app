import { useState, memo } from 'react';
import clsx from 'clsx';
import css from './AddWaterBtn.module.css';
import Icons from '../../assets/icons/sprite.svg';
import WaterModal from '../WaterModal/WaterModal';

const getClassName = (prefixClass, element, css) =>
  css[`${prefixClass}${element}`];

const AddWaterBtn = memo(function AddWaterBtn({
  type = 'primary',
  isAbsolute = false,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const prefixClass = type === 'primary' ? 'primary' : 'secondary';

  const buttonClassName = clsx(css[`${prefixClass}Button`], {
    [css.absolute]: isAbsolute,
  });

  return (
    <>
      <button
        className={buttonClassName}
        onClick={openModal}
        aria-label="Add water"
        aria-haspopup="dialog"
      >
        <svg
          className={getClassName(prefixClass, 'ButtonIcon', css)}
          width={16}
          height={16}
          aria-hidden="true"
        >
          <use href={`${Icons}#icon-plus`}></use>
        </svg>
        <span className={getClassName(prefixClass, 'ButtonText', css)}>
          Add water
        </span>
      </button>

      {isModalOpen && <WaterModal actionType="add" onClose={closeModal} />}
    </>
  );
});

export default AddWaterBtn;
