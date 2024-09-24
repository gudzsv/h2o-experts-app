import { memo } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next'; // Додаємо хук для перекладу
import css from './AddWaterBtn.module.css';
import sprite from '../../assets/icons/sprite.svg';

const getClassName = (prefixClass, element, css) =>
  css[`${prefixClass}${element}`];

const getValidDate = date => {
  const validDate = date instanceof Date && !isNaN(date) ? date : new Date();
  return validDate.toISOString().split('T')[0];
};

const AddWaterBtn = memo(function AddWaterBtn({
  btnType = 'primary',
  isAbsolute = false,
  onClick,
  day,
}) {
  const { t } = useTranslation(); // Ініціалізуємо переклад
  const prefixClass = btnType === 'primary' ? 'primary' : 'secondary';

  const buttonClassName = clsx(css[`${prefixClass}Button`], {
    [css.absolute]: isAbsolute,
  });

  const handleClick = () => {
    const selectedDay = getValidDate(day);

    if (onClick) {
      onClick(selectedDay);
    }
  };

  return (
    <button
      className={buttonClassName}
      onClick={handleClick}
      aria-label={t('addWater')} // Переклад для aria-label
      aria-haspopup="dialog"
      aria-pressed="false"
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
        {t('addWaterBtn.addWater')} {/* Переклад тексту кнопки */}
      </span>
    </button>
  );
});

export default AddWaterBtn;
