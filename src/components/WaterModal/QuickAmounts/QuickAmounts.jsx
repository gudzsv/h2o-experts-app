import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useVolume } from '../../../hooks/useVolume.js';
import { getQuickAmounts } from '../../../helpers/units.js';
import { selectLastWaterEntry } from '../../../redux/water/selectors.js';
import css from './QuickAmounts.module.css';

// `value` and `onSelect` use the displayed unit (ml or oz).
const QuickAmounts = ({ value, onSelect }) => {
  const { t } = useTranslation();
  const { units, unitLabel, toDisplay } = useVolume();
  const lastEntry = useSelector(selectLastWaterEntry);
  const amounts = getQuickAmounts(units);
  const current = Number(value);

  // A repeat chip that equals a preset would only duplicate it.
  const lastAmount = lastEntry ? toDisplay(lastEntry.usedWater) : null;
  const repeatAmount =
    lastAmount !== null && !amounts.includes(lastAmount) ? lastAmount : null;

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
      {amounts.map(amount => renderChip(amount, `${amount} ${unitLabel}`))}
      {repeatAmount !== null &&
        renderChip(
          repeatAmount,
          t('waterForm.repeatLast', { amount: `${repeatAmount} ${unitLabel}` })
        )}
    </div>
  );
};

export default QuickAmounts;
