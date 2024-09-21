import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useId } from 'react';
import styles from './WaterForm.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { addWater, editWater } from '../../../redux/water/operations.js';
import toast from 'react-hot-toast';
import { selectDayWater } from '../../../redux/water/selectors.js';
import sprite from '../../../assets/icons/sprite.svg';

const validationSchema = Yup.object().shape({
  drinkingTime: Yup.string().required('Recording time is required'),
  usedWater: Yup.number()
    .typeError('Water value is required!')
    .positive('Value must be greater than 0')
    .max(9999, 'Value must not exceed 9999')
    .required(),
});

const WaterForm = ({ actionType, waterId, currentDay = '2024-09-15' }) => {
  const timeOptions = Array.from({ length: 24 * 12 }, (_, i) => {
    const hours = String(Math.floor(i / 12)).padStart(2, '0');
    const minutes = String((i % 12) * 5).padStart(2, '0');
    return `${hours}:${minutes}`;
  });

  const waterUsed = useId();
  const selectorTime = useId();

  const dispatch = useDispatch();

  const waterDaily = useSelector(selectDayWater);
  const waterById = waterDaily.find(contact => contact.id === waterId);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      drinkingTime: '00:00',
      usedWater: 50,
    },
    resolver: yupResolver(validationSchema),
  });

  const [waterForm, setWaterForm] = useState({
    time: '00:00',
    water: 50,
  });
  useEffect(() => {
    if (actionType === 'edit' && waterById) {
      setValue('drinkingTime', waterById.drinkingTime.split(' ')[1]);
      setValue('usedWater', waterById.usedWater);
      setWaterForm({
        time: waterById.drinkingTime.split(' ')[1],
        water: waterById.usedWater,
      });
    }
  }, [actionType, waterById, setValue]);

  const plusWater = () => {
    setWaterForm(prevState => {
      const newWater = Number(prevState.water) + 50;
      setValue('usedWater', newWater);
      trigger('usedWater');
      return { ...prevState, water: newWater };
    });
  };

  const minusWater = () => {
    setWaterForm(prevState => {
      const newWater = Number(prevState.water) - 50;
      setValue('usedWater', newWater);
      trigger('usedWater');
      return { ...prevState, water: newWater };
    });
  };

  const handleChangeTime = event => {
    const { value } = event.target;
    setWaterForm({
      ...waterForm,
      time: value,
    });
  };

  const handleChangeWater = event => {
    const { value } = event.target;
    setValue('usedWater', value);
    trigger('usedWater');
    setWaterForm({
      ...waterForm,
      water: value,
    });
  };

  const formatDateTime = (date, time) => {
    const formattedDate = date.toString().split('T')[0]; // 'YYYY-MM-DD'
    return `${formattedDate}T${time}:00`; // 'YYYY-MM-DD HH:mm:ss'
  };

  const onSubmit = data => {
    const formattedDateTime = formatDateTime(currentDay, waterForm.time);
    const payload = { ...data, drinkingTime: formattedDateTime };
    console.log(formattedDateTime);

    console.log('after data', payload);

    if (actionType === 'add') {
      dispatch(addWater(payload));
      toast.success('Water added successfully!');
    } else if (actionType === 'edit') {
      dispatch(editWater(payload));
      toast.success('Water updated successfully!');
    } else {
      toast.error('No action was specified. Please try again.');
    }
    console.log(payload);
  };

  return (
    <>
      {actionType === 'edit' ? (
        <h2 className={`${styles.secondTitle} ${styles.secondTitleMargin}`}>
          Correct entered data:
        </h2>
      ) : actionType === 'add' ? (
        <h2 className={`${styles.secondTitle} ${styles.secondTitleMargin}`}>
          Choose a value:
        </h2>
      ) : (
        <h2>...</h2>
      )}

      <h2 className={styles.secondTitleRegular}>Amount of water:</h2>

      <div className={styles.container}>
        <svg
          onClick={minusWater}
          className={`${styles.icon} ${
            waterForm.water <= 0 ? styles.disabled : ''
          }`}
          width="43"
          height="43"
        >
          <use href={`${sprite}#icon-minus-btn`}></use>
        </svg>
        <p className={styles.ml}>{waterForm.water} ml</p>
        <svg onClick={plusWater} className={styles.icon} width="43" height="43">
          <use href={`${sprite}#icon-plus-btn`}></use>
        </svg>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.wrapperSelector}>
          <label htmlFor={selectorTime} className={styles.secondTitleRegular}>
            Recording time:
          </label>
          <select
            id={selectorTime}
            {...register('drinkingTime')}
            value={waterForm.time}
            onChange={handleChangeTime}
            className={styles.input}
          >
            {timeOptions.map(time => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          {errors.recordingTime && <span>{errors.recordingTime.message}</span>}
        </div>
        <div className={styles.wrapperNumber}>
          <label htmlFor={waterUsed} className={styles.secondTitle}>
            Enter the value of the water used:
          </label>
          <input
            type="number"
            {...register('usedWater')}
            onChange={handleChangeWater}
            value={waterForm.water}
            id={waterUsed}
            className={styles.input}
          />
          {errors.waterMl && <span>{errors.waterMl.message}</span>}
        </div>
        <button className={styles.submit}>Save</button>
      </form>
    </>
  );
};

export default WaterForm;
