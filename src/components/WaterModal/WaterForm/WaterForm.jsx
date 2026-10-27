import { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import styles from './WaterForm.module.css';
import { useDispatch } from 'react-redux';
import { addWater, editWater } from '../../../redux/water/operations.js';

import sprite from '../../../assets/icons/sprite.svg';
import { onActivate } from '../../../helpers/a11y';
import QuickAmounts from '../QuickAmounts/QuickAmounts.jsx';

const generateTimeOptions = () => {
  return Array.from({ length: 24 * 12 }, (_, i) => {
    const hours = String(Math.floor(i / 12)).padStart(2, '0');
    const minutes = String((i % 12) * 5).padStart(2, '0');
    return `${hours}:${minutes}`;
  });
};

const timeOptions = generateTimeOptions();

const WaterForm = ({ actionType, waterItem, currentDay, closeModal }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const now = new Date();
  const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(
    Math.floor(now.getMinutes() / 5) * 5
  ).padStart(2, '0')}`;

  const defaultDrinkingTime =
    actionType === 'edit'
      ? waterItem.drinkingTime.split('T')[1].slice(0, 5)
      : formattedTime;

  const defaultUsedWater = actionType === 'edit' ? waterItem.usedWater : 50;

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
      .max(9999, t('validationForm.usedWaterMax')),
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    trigger,
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

  useEffect(() => {
    if (actionType === 'edit' && waterItem) {
      const initialTime = waterItem.drinkingTime.split('T')[1].slice(0, 5);
      setValue('drinkingTime', initialTime);
      setValue('usedWater', waterItem.usedWater);
    }
  }, [actionType, waterItem, setValue]);

  const selectAmount = useCallback(
    amount => {
      setValue('usedWater', amount, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue]
  );

  // Мемоїзовані функції
  const plusWater = useCallback(() => {
    const currentWater = Number(getValues('usedWater'));
    const newWater = currentWater + 50;
    setValue('usedWater', newWater);
    trigger('usedWater');
  }, [getValues, setValue, trigger]);

  const minusWater = useCallback(() => {
    const currentWater = Number(getValues('usedWater'));
    const newWater = currentWater - 50;
    setValue('usedWater', newWater);
    trigger('usedWater');
  }, [getValues, setValue, trigger]);

  const formatDateTime = (date, time) => {
    const formattedDate = date.toString().split('T')[0];
    return `${formattedDate}T${time}:00`;
  };

  const onSubmit = async data => {
    const formattedDateTime = formatDateTime(currentDay, data.drinkingTime);
    const payload = { ...data, drinkingTime: formattedDateTime };

    closeModal();

    if (actionType === 'add') {
      await dispatch(addWater(payload));
    } else if (actionType === 'edit') {
      await dispatch(editWater({ waterId: waterItem._id, ...payload }));
    }
  };

  return (
    <>
      <h2
        className={`${styles.secondTitle} ${styles.secondTitleMargin}`}
        id="formTitle"
      >
        {actionType === 'edit'
          ? t('waterForm.titleEdit')
          : t('waterForm.titleAdd')}
        :
      </h2>

      <h2 className={styles.secondTitleRegular}>
        {t('waterForm.secondTitle')}:
      </h2>

      <div className={styles.container}>
        <svg
          onClick={getValues('usedWater') > 49 ? minusWater : null}
          onKeyDown={
            getValues('usedWater') > 49 ? onActivate(minusWater) : undefined
          }
          className={`${styles.icon} ${
            getValues('usedWater') <= 49 ? styles.disabled : ''
          }`}
          width="43"
          height="43"
          aria-label={t('waterForm.minusWater')}
          role="button"
          tabIndex={getValues('usedWater') > 49 ? 0 : -1}
        >
          <use href={`${sprite}#icon-minus-btn`}></use>
        </svg>
        <p className={styles.ml} aria-live="polite" aria-atomic="true">
          {watch('usedWater')} {t('chooseDate.ml')}
        </p>
        <svg
          onClick={getValues('usedWater') < 9950 ? plusWater : null}
          onKeyDown={
            getValues('usedWater') < 9950 ? onActivate(plusWater) : undefined
          }
          className={`${styles.icon} ${
            getValues('usedWater') >= 9950 ? styles.disabled : ''
          }`}
          width="43"
          height="43"
          aria-label={t('waterForm.plusWater')}
          role="button"
          tabIndex={getValues('usedWater') < 9950 ? 0 : -1}
        >
          <use href={`${sprite}#icon-plus-btn`}></use>
        </svg>
      </div>

      {actionType === 'add' && (
        <QuickAmounts value={watch('usedWater')} onSelect={selectAmount} />
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
            {timeOptions.map(time => (
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
            {t('waterForm.waterUsed')}:
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
