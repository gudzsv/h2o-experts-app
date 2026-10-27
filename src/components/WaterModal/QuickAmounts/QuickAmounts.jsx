import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { QUICK_AMOUNTS_ML } from '../../../constants/constants.js';
import { selectLastWaterEntry } from '../../../redux/water/selectors.js';
import css from './QuickAmounts.module.css';

const QuickAmounts = ({ value, onSelect }) => {
  const { t } = useTranslation();
  const lastEntry = useSelector(selectLastWaterEntry);
  const unit = t('chooseDate.ml');
  const current = Number(value);

  // A repeat chip that equals a preset would only duplicate it.
  const repeatAmount =
    lastEntry && !QUICK_AMOUNTS_ML.includes(lastEntry.usedWater)
      ? lastEntry.usedWater
      : null;

  const renderChip = (amount, label) => (
    <button
      key={label}
      type="button"
      className={clsx(css.chip, current === amount && css.chipActive)}
      aria-pressed={current === amount}
      onClick={() => onSelect(amount)}
    >
      {label}
    </button>
  );

  return (
    <div
      className={css.group}
      role="group"
      aria-label={t('waterForm.quickAmounts')}
    >
      {QUICK_AMOUNTS_ML.map(amount => renderChip(amount, `${amount} ${unit}`))}
      {repeatAmount !== null &&
        renderChip(
          repeatAmount,
          t('waterForm.repeatLast', { amount: `${repeatAmount} ${unit}` })
        )}
    </div>
  );
};

export default QuickAmounts;
