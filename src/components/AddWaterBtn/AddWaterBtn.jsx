import { memo } from 'react';
import clsx from 'clsx';
import css from './AddWaterBtn.module.css';
import sprite from '../../assets/icons/sprite.svg';

const getClassName = (prefixClass, element, css) =>
  css[`${prefixClass}${element}`];

const AddWaterBtn = memo(function AddWaterBtn({
  btnType = 'primary',
  isAbsolute = false,
  onClick,
  day,
}) {
  const prefixClass = btnType === 'primary' ? 'primary' : 'secondary';

  const buttonClassName = clsx(css[`${prefixClass}Button`], {
    [css.absolute]: isAbsolute,
  });

  const getValidDate = date => {
    const validDate = date instanceof Date && !isNaN(date) ? date : new Date();
    return validDate.toISOString().split('T')[0];
  };

  const handleClick = () => {
    const selectedDay = getValidDate(day);

    console.log('Received day prop in AddWaterBtn:', day);
    console.log('Selected day (processed in AddWaterBtn):', selectedDay);

    if (onClick) {
      console.log('Calling onClick with:', selectedDay);
      onClick(selectedDay);
    }
  };

  return (
    <>
      <button
        className={buttonClassName}
        onClick={handleClick}
        aria-label="Add water"
        aria-haspopup="dialog"
      >
        <svg
          className={getClassName(prefixClass, 'ButtonIcon', css)}
          width={16}
          height={16}
          aria-hidden="true"
        >
          <use href={`${sprite}#icon-plus`}></use>
        </svg>
        <span className={getClassName(prefixClass, 'ButtonText', css)}>
          Add water
        </span>
      </button>
    </>
  );
});

export default AddWaterBtn;
