import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import styles from './WaterForm.module.css';
import { useDispatch } from 'react-redux';
import { addWater, editWater } from '../../../redux/water/operations.js';

import {
  getEntryTime,
  TIME_OPTIONS,
  toDrinkingTime,
  toTimeOption,
} from '../../../helpers/date.js';
import { getDefaultAmount, getMaxAmount } from '../../../helpers/units.js';
import { useVolume } from '../../../hooks/useVolume.js';
import QuickAmounts from '../QuickAmounts/QuickAmounts.jsx';

const WaterForm = ({ actionType, waterItem, currentDay, closeModal }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { units, unitLabel, toDisplay, fromDisplay } = useVolume();
  const maxAmount = getMaxAmount(units);

  const isEdit = actionType === 'edit';
  const defaultDrinkingTime = isEdit
    ? getEntryTime(waterItem)
    : toTimeOption(new Date());
  const defaultUsedWater = isEdit
    ? toDisplay(waterItem.usedWater)
    : getDefaultAmount(units);

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

  const onSubmit = async data => {
    // Keep the stored amount when an entry is saved without touching it:
    // converting to ounces and back would round it.
    const isAmountUntouched =
      isEdit && Number(data.usedWater) === toDisplay(waterItem.usedWater);
    const usedWater = isAmountUntouched
      ? waterItem.usedWater
      : fromDisplay(Number(data.usedWater));
    const payload = {
      ...data,
      usedWater,
      drinkingTime: toDrinkingTime(currentDay, data.drinkingTime),
    };

    closeModal();

    if (isEdit) {
      await dispatch(editWater({ waterId: waterItem._id, ...payload }));
    } else {
      await dispatch(addWater(payload));
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
