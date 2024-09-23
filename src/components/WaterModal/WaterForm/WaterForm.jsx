// import { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as Yup from 'yup';
// import { useTranslation } from 'react-i18next';
// import { useId } from 'react';
// import styles from './WaterForm.module.css';
// import { useDispatch } from 'react-redux';
// import {
//   addWater,
//   editWater,
//   getMonthWater,
// } from '../../../redux/water/operations.js';

// import sprite from '../../../assets/icons/sprite.svg';

// const validationSchema = Yup.object().shape({
//   drinkingTime: Yup.string().required('Recording time is required'),
//   usedWater: Yup.number()
//     .typeError('Water value is required!')
//     .positive('Value must be greater than 0')
//     .max(9999, 'Value must not exceed 9999')
//     .required(),
// });

// const WaterForm = ({ actionType, waterItem, currentDay, closeModal }) => {
//   const timeOptions = Array.from({ length: 24 * 12 }, (_, i) => {
//     const hours = String(Math.floor(i / 12)).padStart(2, '0');
//     const minutes = String((i % 12) * 5).padStart(2, '0');
//     return `${hours}:${minutes}`;
//   });

//   const waterUsed = useId();
//   const selectorTime = useId();

//   const { t } = useTranslation();

//   const dispatch = useDispatch();

//   const now = new Date();
//   const formattedTime = `${now.getHours()}:${String(
//     Math.round(now.getMinutes() / 5) * 5
//   ).padStart(2, '0')}`;

//   const defaultDrinkingTime =
//     actionType === 'edit'
//       ? waterItem.drinkingTime.split('T')[1].slice(0, 5)
//       : formattedTime;

//   const defaultUsedWater = actionType === 'edit' ? waterItem.usedWater : 50;

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     trigger,
//     formState: { errors, isValid },
//   } = useForm({
//     mode: 'onChange',
//     defaultValues: {
//       drinkingTime: defaultDrinkingTime,
//       usedWater: defaultUsedWater,
//     },
//     resolver: yupResolver(validationSchema),
//   });

//   const [waterForm, setWaterForm] = useState({
//     time: defaultDrinkingTime,
//     water: defaultUsedWater,
//   });
//   useEffect(() => {
//     if (actionType === 'edit' && waterItem) {
//       const initialTime = waterItem.drinkingTime.split('T')[1].slice(0, 5);
//       setValue('drinkingTime', initialTime);
//       setValue('usedWater', waterItem.usedWater);
//       setWaterForm({
//         time: initialTime || defaultDrinkingTime,
//         water: waterItem.usedWater,
//       });
//     }
//   }, [actionType, waterItem, setValue, defaultDrinkingTime]);

//   const plusWater = () => {
//     setWaterForm(prevState => {
//       const newWater = Number(prevState.water) + 50;
//       setValue('usedWater', newWater);
//       trigger('usedWater');
//       return { ...prevState, water: newWater };
//     });
//   };

//   const minusWater = () => {
//     setWaterForm(prevState => {
//       const newWater = Number(prevState.water) - 50;
//       setValue('usedWater', newWater);
//       trigger('usedWater');
//       return { ...prevState, water: newWater };
//     });
//   };

//   const handleChangeTime = event => {
//     const { value } = event.target;
//     setWaterForm({
//       ...waterForm,
//       time: value,
//     });
//   };

//   const handleChangeWater = event => {
//     const { value } = event.target;
//     setValue('usedWater', value);
//     trigger('usedWater');
//     setWaterForm({
//       ...waterForm,
//       water: value,
//     });
//   };

//   const formatDateTime = (date, time) => {
//     const formattedDate = date.toString().split('T')[0];
//     return `${formattedDate}T${time}:00`;
//   };

//   const onSubmit = data => {
//     const formattedDateTime = formatDateTime(currentDay, waterForm.time);
//     const payload = { ...data, drinkingTime: formattedDateTime };

//     if (actionType === 'add') {
//       dispatch(addWater(payload));
//       console.log(payload);

//       setTimeout(() => {
//         dispatch(getMonthWater(currentDay.slice(0, -3)));
//       }, 1000);
//     } else if (actionType === 'edit') {
//       dispatch(
//         editWater({
//           waterId: waterItem._id,
//           ...payload,
//         })
//       );
//       setTimeout(() => {
//         dispatch(getMonthWater(currentDay.slice(0, -3)));
//       }, 1000);
//     }
//     closeModal();
//   };

//   return (
//     <>
//       {actionType === 'edit' ? (
//         <h2 className={`${styles.secondTitle} ${styles.secondTitleMargin}`}>
//           {t('waterForm.titleEdit')}:
//         </h2>
//       ) : actionType === 'add' ? (
//         <h2 className={`${styles.secondTitle} ${styles.secondTitleMargin}`}>
//           {t('waterForm.titleAdd')}:
//         </h2>
//       ) : (
//         <h2>...</h2>
//       )}

//       <h2 className={styles.secondTitleRegular}>
//         {t('waterForm.secondTitle')}:
//       </h2>

//       <div className={styles.container}>
//         <svg
//           onClick={minusWater}
//           className={`${styles.icon} ${
//             waterForm.water <= 0 ? styles.disabled : ''
//           }`}
//           width="43"
//           height="43"
//         >
//           <use href={`${sprite}#icon-minus-btn`}></use>
//         </svg>
//         <p className={styles.ml}>{waterForm.water} ml</p>
//         <svg onClick={plusWater} className={styles.icon} width="43" height="43">
//           <use href={`${sprite}#icon-plus-btn`}></use>
//         </svg>
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)}>
//         <div className={styles.wrapperSelector}>
//           <label htmlFor={selectorTime} className={styles.secondTitleRegular}>
//             {t('waterForm.time')}:
//           </label>
//           <select
//             id={selectorTime}
//             {...register('drinkingTime')}
//             value={waterForm.time}
//             onChange={handleChangeTime}
//             className={`${styles.input} ${
//               errors.drinkingTime ? styles.error : ''
//             }`}
//           >
//             {timeOptions.map(time => (
//               <option key={time} value={time}>
//                 {time}
//               </option>
//             ))}
//           </select>
//           {errors.drinkingTime && (
//             <span className={styles.errorMessage}>
//               {errors.drinkingTime.message}
//             </span>
//           )}
//         </div>
//         <div className={styles.wrapperNumber}>
//           <label htmlFor={waterUsed} className={styles.secondTitle}>
//             {t('waterForm.waterUsed')}:
//           </label>
//           <input
//             type="number"
//             {...register('usedWater')}
//             onChange={handleChangeWater}
//             value={waterForm.water}
//             id={waterUsed}
//             className={`${styles.input} ${
//               errors.usedWater ? styles.error : ''
//             }`}
//           />
//           {errors.usedWater && (
//             <span className={styles.errorMessage}>
//               {errors.usedWater.message}
//             </span>
//           )}
//         </div>
//         <button
//           className={`${styles.submit} ${!isValid ? styles.disabledBtn : ''}`}
//           disabled={!isValid}
//         >
//           {t('waterForm.button')}
//         </button>
//       </form>
//     </>
//   );
// };

// export default WaterForm;

import { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import styles from './WaterForm.module.css';
import { useDispatch } from 'react-redux';
import {
  addWater,
  editWater,
  getMonthWater,
} from '../../../redux/water/operations.js';

import sprite from '../../../assets/icons/sprite.svg';

// Функція для генерації timeOptions
const generateTimeOptions = () => {
  return Array.from({ length: 24 * 12 }, (_, i) => {
    const hours = String(Math.floor(i / 12)).padStart(2, '0');
    const minutes = String((i % 12) * 5).padStart(2, '0');
    return `${hours}:${minutes}`;
  });
};

const validationSchema = Yup.object().shape({
  drinkingTime: Yup.string().required('Recording time is required'),
  usedWater: Yup.number()
    .typeError('Water value is required!')
    .positive('Value must be greater than 0')
    .max(9999, 'Value must not exceed 9999')
    .required(),
});

const WaterForm = ({ actionType, waterItem, currentDay, closeModal }) => {
  const timeOptions = generateTimeOptions(); // Винесена за компонент
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const now = new Date();
  const formattedTime = `${now.getHours()}:${String(
    Math.round(now.getMinutes() / 5) * 5
  ).padStart(2, '0')}`;

  const defaultDrinkingTime =
    actionType === 'edit'
      ? waterItem.drinkingTime.split('T')[1].slice(0, 5)
      : formattedTime;

  const defaultUsedWater = actionType === 'edit' ? waterItem.usedWater : 50;

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    trigger,
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

    try {
      if (actionType === 'add') {
        await dispatch(addWater(payload));
      } else if (actionType === 'edit') {
        await dispatch(editWater({ waterId: waterItem._id, ...payload }));
      }

      await dispatch(getMonthWater(currentDay.slice(0, -3)));
    } catch (error) {
      console.error(error);
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
          onClick={minusWater}
          className={`${styles.icon} ${
            getValues('usedWater') <= 0 ? styles.disabled : ''
          }`}
          width="43"
          height="43"
          aria-label={t('waterForm.minusWater')}
          role="button"
          tabIndex={0}
        >
          <use href={`${sprite}#icon-minus-btn`}></use>
        </svg>
        <p className={styles.ml} aria-live="polite" aria-atomic="true">
          {getValues('usedWater')} ml
        </p>
        <svg
          onClick={plusWater}
          className={styles.icon}
          width="43"
          height="43"
          aria-label={t('waterForm.plusWater')}
          role="button"
          tabIndex={0}
        >
          <use href={`${sprite}#icon-plus-btn`}></use>
        </svg>
      </div>

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
