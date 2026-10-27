import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import styles from './WaterForm.module.css';
import toast from 'react-hot-toast';
import { useDispatch, useStore } from 'react-redux';
import { addWater, editWater } from '../../../redux/water/operations.js';
import { selectTodayTotal } from '../../../redux/water/selectors.js';
import { selectUser } from '../../../redux/auth/selectors.js';
import {
  DEFAULT_DAILY_NORMA,
  MESSAGES,
} from '../../../constants/constants.js';
import { didReachGoal } from '../../../helpers/celebrations.js';

import {
  getEntryTime,
  TIME_OPTIONS,
  toDrinkingTime,
  toTimeOption,
} from '../../../helpers/date.js';
import { getDefaultAmount, getMaxAmount } from '../../../helpers/units.js';
import { useVolume } from '../../../hooks/useVolume.js';
import QuickAmounts from '../QuickAmounts/QuickAmounts.jsx';
import DrinkPicker from '../DrinkPicker/DrinkPicker.jsx';
import {
  countHydration,
  DEFAULT_DRINK,
  DRINK_COEFFICIENTS,
  getDrinkType,
} from '../../../helpers/drinks.js';

const WaterForm = ({ actionType, waterItem, currentDay, closeModal }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const store = useStore();
  const { units, unitLabel, format, toDisplay, fromDisplay } = useVolume();
  const maxAmount = getMaxAmount(units);

  const isEdit = actionType === 'edit';
  const defaultDrinkingTime = isEdit
    ? getEntryTime(waterItem)
    : toTimeOption(new Date());
  const defaultUsedWater = isEdit
    ? toDisplay(waterItem.usedWater)
    : getDefaultAmount(units);
  const savedDrinkType = isEdit ? getDrinkType(waterItem) : DEFAULT_DRINK;

  const validationSchema = Yup.object().shape({
    drinkingTime: Yup.string().required(
      t('validationForm.drinkingTimeRequired')
    ),
    usedWater: Yup.number()
      .nullable()
      .transform((value, originalValue) => {
        return originalValue === '' ? null : value;
      })
      .required(t('validationForm.usedWaterRequired'))
      .typeError(t('validationForm.usedWaterTypeError'))
      .positive(t('validationForm.usedWaterPositive'))
      .integer(t('validationForm.usedWaterInteger'))
      .max(maxAmount, t('validationForm.usedWaterMax', { max: maxAmount })),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      drinkingTime: defaultDrinkingTime,
      usedWater: defaultUsedWater,
      drinkType: savedDrinkType,
    },
    resolver: yupResolver(validationSchema),
  });

  const selectAmount = useCallback(
    amount => {
      setValue('usedWater', amount, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue]
  );

  const selectDrink = useCallback(
    drinkType => {
      setValue('drinkType', drinkType, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue]
  );

  const drinkType = watch('drinkType');
  const amount = Number(watch('usedWater'));
  const countedMl =
    drinkType !== DEFAULT_DRINK && amount > 0
      ? countHydration(fromDisplay(amount), drinkType)
      : null;

  const onSubmit = async data => {
    // Keep the stored amount when an entry is saved without touching it:
    // converting to ounces and back would round it.
    const isAmountUntouched =
      isEdit && Number(data.usedWater) === toDisplay(waterItem.usedWater);
    const usedWater = isAmountUntouched
      ? waterItem.usedWater
      : fromDisplay(Number(data.usedWater));
    const payload = {
      usedWater,
      drinkingTime: toDrinkingTime(currentDay, data.drinkingTime),
    };
    // Water is the server's default, so it is only sent when an entry changes
    // to it; a server without drink types then still accepts plain water.
    if (data.drinkType !== savedDrinkType || data.drinkType !== DEFAULT_DRINK) {
      payload.drinkType = data.drinkType;
    }

    closeModal();

    const before = selectTodayTotal(store.getState());

    if (isEdit) {
      await dispatch(editWater({ waterId: waterItem._id, ...payload }));
    } else {
      await dispatch(addWater(payload));
    }

    const state = store.getState();
    const goal = selectUser(state)?.dailyRequirement || DEFAULT_DAILY_NORMA;
    if (didReachGoal(before, selectTodayTotal(state), goal)) {
      // One message instead of two: the celebration replaces "added".
      toast.dismiss(MESSAGES.SUCCESS.ADD_WATER);
      toast.dismiss(MESSAGES.SUCCESS.EDIT_WATER);
      toast.success(t('celebrate.goalMet'), { id: 'goal-met', icon: '🎉' });
    }
  };

  return (
    <>
      <h2
        className={`${styles.secondTitle} ${styles.secondTitleMargin}`}
        id="formTitle"
      >
        {isEdit ? t('waterForm.titleEdit') : t('waterForm.titleAdd')}
        :
      </h2>

      <p className={styles.secondTitleRegular}>
        {t('waterForm.drink')}:
      </p>
      <DrinkPicker value={drinkType} onSelect={selectDrink} />

      {!isEdit && (
        <>
          <h2 className={styles.secondTitleRegular}>
            {t('waterForm.secondTitle')}:
          </h2>
          <QuickAmounts value={watch('usedWater')} onSelect={selectAmount} />
        </>
      )}

      <form onSubmit={handleSubmit(onSubmit)} aria-labelledby="formTitle">
        <div className={styles.wrapperSelector}>
          <label htmlFor="drinkingTime" className={styles.secondTitleRegular}>
            {t('waterForm.time')}:
          </label>
          <select
            {...register('drinkingTime')}
            id="drinkingTime"
            className={`${styles.input} ${
              errors.drinkingTime ? styles.error : ''
            }`}
            aria-invalid={errors.drinkingTime ? 'true' : 'false'}
            aria-describedby="drinkingTimeError"
          >
            {TIME_OPTIONS.map(time => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          {errors.drinkingTime && (
            <span
              className={styles.errorMessage}
              id="drinkingTimeError"
              role="alert"
            >
              {errors.drinkingTime.message}
            </span>
          )}
        </div>

        <div className={styles.wrapperNumber}>
          <label htmlFor="usedWater" className={styles.secondTitle}>
            {t('waterForm.waterUsed', { unit: unitLabel })}:
          </label>
          <input
            type="number"
            {...register('usedWater')}
            id="usedWater"
            className={`${styles.input} ${
              errors.usedWater ? styles.error : ''
            }`}
            aria-invalid={errors.usedWater ? 'true' : 'false'}
            aria-describedby="usedWaterError"
          />
          {errors.usedWater && (
            <span
              className={styles.errorMessage}
              id="usedWaterError"
              role="alert"
            >
              {errors.usedWater.message}
            </span>
          )}
          {countedMl !== null && !errors.usedWater && (
            <p className={styles.counted} aria-live="polite">
              {t('waterForm.counted', {
                amount: format(countedMl),
                percent: Math.round(DRINK_COEFFICIENTS[drinkType] * 100),
              })}
            </p>
          )}
        </div>

        <button
          className={`${styles.submit} ${!isValid ? styles.disabledBtn : ''}`}
          disabled={!isValid}
          aria-disabled={!isValid}
        >
          {t('waterForm.button')}
        </button>
      </form>
    </>
  );
};

export default WaterForm;
