import { useCallback, useEffect, useRef, useState } from 'react';
import { fromDisplayAmount, toDisplayAmount } from '../../helpers/units.js';

// The initial value of the daily norm field, shown in the saved units.
export const getInitialNormField = (normMl, units) =>
  normMl === undefined ? normMl : toDisplayAmount(normMl, units);

// The daily norm is stored in ml while the field shows the chosen units.
// Keeping the exact ml value here means switching units back and forth, or
// saving without editing, never rounds the stored norm.
export const useDailyNorm = ({
  dailyRequirement,
  initialUnits,
  unitsValue,
  setValue,
}) => {
  const [normMl, setNormMl] = useState(dailyRequirement);
  const previousUnits = useRef(initialUnits);

  useEffect(() => {
    if (previousUnits.current === unitsValue) {
      return;
    }

    previousUnits.current = unitsValue;
    if (normMl) {
      setValue('dailyRequirement', toDisplayAmount(normMl, unitsValue));
    }
  }, [unitsValue, normMl, setValue]);

  const handleNormChange = useCallback(
    event => {
      setNormMl(fromDisplayAmount(Number(event.target.value), unitsValue));
    },
    [unitsValue]
  );

  // Takes an exact ml value, e.g. the recommended norm, into the field.
  const applyNormMl = useCallback(
    ml => {
      setNormMl(ml);
      setValue('dailyRequirement', toDisplayAmount(ml, unitsValue), {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [unitsValue, setValue]
  );

  return { normMl, handleNormChange, applyNormMl };
};
