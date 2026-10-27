import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useVolume } from '../../../hooks/useVolume.js';
import { getQuickAmounts } from '../../../helpers/units.js';
import css from './QuickAmounts.module.css';

// `value` and `onSelect` use the displayed unit (ml or oz).
const QuickAmounts = ({ value, onSelect }) => {
  const { t } = useTranslation();
  const { units, unitLabel } = useVolume();
  const current = Number(value);

  return (
    <div
      className={css.group}
      role="group"
      aria-label={t('waterForm.quickAmounts')}
    >
      {getQuickAmounts(units).map(amount => (
        <button
          key={amount}
          type="button"
          className={clsx(css.chip, current === amount && css.chipActive)}
          aria-pressed={current === amount}
          onClick={() => onSelect(amount)}
        >
          {amount} {unitLabel}
        </button>
      ))}
    </div>
  );
};

export default QuickAmounts;
