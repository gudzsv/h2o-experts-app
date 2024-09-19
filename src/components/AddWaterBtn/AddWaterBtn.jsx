import { memo } from 'react';
import clsx from 'clsx';
import css from './AddWaterBtn.module.css';
import sprite from '../../assets/icons/sprite.svg';

const getClassName = (prefixClass, element, css) =>
  css[`${prefixClass}${element}`];

const AddWaterBtn = memo(function AddWaterBtn({
  btnType = 'primary',
  isAbsolute = false,
  onOpenModel,
}) {
  const prefixClass = btnType === 'primary' ? 'primary' : 'secondary';

  const buttonClassName = clsx(css[`${prefixClass}Button`], {
    [css.absolute]: isAbsolute,
  });

  return (
    <>
      <button
        className={buttonClassName}
        onClick={onOpenModel}
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
