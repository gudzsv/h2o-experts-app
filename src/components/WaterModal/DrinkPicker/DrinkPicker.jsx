import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import DrinkIcon from 'components/DrinkIcon/DrinkIcon.jsx';
import { DRINK_TYPES } from '../../../helpers/drinks.js';
// The same chips as the quick amounts.
import css from '../QuickAmounts/QuickAmounts.module.css';

const DrinkPicker = ({ value, onSelect }) => {
  const { t } = useTranslation();

  return (
    <div
      className={css.group}
      role="radiogroup"
      aria-label={t('waterForm.drink')}
    >
      {DRINK_TYPES.map(type => (
        <button
          key={type}
          type="button"
          role="radio"
          aria-checked={value === type}
          className={clsx(css.chip, value === type && css.chipActive)}
          onClick={() => onSelect(type)}
        >
          <DrinkIcon type={type} size={16} inherit />
          {t(`drinks.${type}`)}
        </button>
      ))}
    </div>
  );
};

export default DrinkPicker;
