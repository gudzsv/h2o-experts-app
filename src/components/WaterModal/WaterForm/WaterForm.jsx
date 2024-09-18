import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useId } from 'react';
import styles from './WaterForm.module.css';

const validationSchema = Yup.object().shape({
  recordingTime: Yup.string().required('Recording time is required'),
  waterMl: Yup.number()
    .typeError('Water value is required!')
    .positive('Value must be greater than 0')
    .max(9999, 'Value must not exceed 9999')
    .required(),
});

const WaterForm = ({ edit, add, value = 50 }) => {
  const waterUsed = useId();
  const selectorTime = useId();
  const timeOptions = Array.from({ length: 24 * 12 }, (_, i) => {
    const hours = String(Math.floor(i / 12)).padStart(2, '0');
    const minutes = String((i % 12) * 5).padStart(2, '0');
    return `${hours}:${minutes}`;
  });

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  const [waterForm, setWaterForm] = useState({
    time: '00:00',
    water: value,
  });

  const plusWater = () => {
    setWaterForm(prevState => {
      const newWater = Number(prevState.water) + 50;
      setValue('waterMl', newWater);
      trigger('waterMl');
      return { ...prevState, water: newWater };
    });
  };

  const minusWater = () => {
    setWaterForm(prevState => {
      const newWater = Number(prevState.water) - 50;
      setValue('waterMl', newWater);
      trigger('waterMl');
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
    setValue('waterMl', value);
    trigger('waterMl');
    setWaterForm({
      ...waterForm,
      water: value,
    });
  };

  const onSubmit = data => {
    console.log(data);
  };

  return (
    <>
      {edit ? (
        <h2 className={`${styles.secondTitle} ${styles.secondTitleMargin}`}>
          Correct entered data:
        </h2>
      ) : add ? (
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
          <use href="/src/assets/icons/sprite.svg#icon-minus-btn"></use>
        </svg>
        <p className={styles.ml}>{waterForm.water} ml</p>
        <svg onClick={plusWater} className={styles.icon} width="43" height="43">
          <use href="/src/assets/icons/sprite.svg#icon-plus-btn"></use>
        </svg>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.wrapperSelector}>
          <label htmlFor={selectorTime} className={styles.secondTitleRegular}>
            Recording time:
          </label>
          <select
            id={selectorTime}
            {...register('recordingTime')}
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
            {...register('waterMl')}
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
