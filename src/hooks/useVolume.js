import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectUnits } from '../redux/auth/selectors.js';
import {
  formatDailyNorm,
  formatVolume,
  fromDisplayAmount,
  normalizeUnits,
  toDisplayAmount,
  UNITS,
} from '../helpers/units.js';

export const useVolume = () => {
  const { t } = useTranslation();
  const units = normalizeUnits(useSelector(selectUnits));

  return useMemo(() => {
    const labels = {
      ml: t('chooseDate.ml'),
      l: t('chooseDate.l'),
      oz: t('units.oz'),
    };

    return {
      units,
      unitLabel: units === UNITS.OZ ? labels.oz : labels.ml,
      format: ml => formatVolume(ml, units, labels),
      formatNorm: ml => formatDailyNorm(ml, units, labels),
      toDisplay: ml => toDisplayAmount(ml, units),
      fromDisplay: value => fromDisplayAmount(value, units),
    };
  }, [t, units]);
};
