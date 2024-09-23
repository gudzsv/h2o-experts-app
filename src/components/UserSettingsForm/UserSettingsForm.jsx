import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import css from './UserSettingsForm.module.css';
import * as Yup from 'yup';
import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editUser } from '../../redux/auth/operations';
import { selectUser } from '../../redux/auth/selectors';

const userSettingsValidationSchema = Yup.object().shape({
  userImage: Yup.mixed(),
  gender: Yup.string().required('Please select your gender'),
  userName: Yup.string()
    .min(3, 'The minimum number of characters is 3')
    .max(50, 'The maximum number of characters is 50')
    .required('Name is required'),
  userEmail: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  userWeight: Yup.number(),
  userTime: Yup.number(),
  dailyRequirement: Yup.number(),
});

const UserSettingsForm = () => {
  const dispatch = useDispatch();
  const [imagePreview, setImagePreview] = useState();
  const { email } = useSelector(selectUser);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSettingsValidationSchema),
    defaultValues: {
      userEmail: email,
    },
  });

  const handleImageChange = useCallback(
    event => {
      const file = event.target.files[0];
      if (file) {
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
        }
        const objectUrl = URL.createObjectURL(file);
        setImagePreview(objectUrl);
        setValue('userImage', file);
      }
    },
    [imagePreview, setValue]
  );

  const onSubmitForm = useCallback(
    async data => {
      const formData = new FormData();
      formData.append('name', data.userName);
      formData.append('gender', data.gender);
      formData.append('email', data.userEmail || '');
      formData.append('weight', data.userWeight || 0);
      formData.append('activityLevel', data.userTime || 0);
      formData.append('dailyRequirement', data.dailyRequirement || 0);
      if (data.userImage && data.userImage.length > 0) {
        formData.append('photo', data.userImage[0]);
      }
      try {
        await dispatch(editUser(formData));
      } catch (error) {
        console.log('error:', error);
      }
    },
    [dispatch]
  );

  return (
    <form className={css.form} onSubmit={handleSubmit(onSubmitForm)}>
      <div className={css.uploadContainer}>
        <input
          type="file"
          id="userImage"
          className={css.fileImage}
          accept="image/*"
          {...register('userImage')}
          onChange={handleImageChange}
        />
        <img
          src={
            imagePreview ||
            '/src/assets/img/settings_avatar/settings_avatar_mob_1x.webp'
          }
          srcSet={
            imagePreview
              ? `${imagePreview}`
              : '/src/assets/img/settings_avatar/settings_avatar_mob_1x.webp, /src/assets/img/settings_avatar/settings_avatar_mob_2x.webp'
          }
          alt="User photo"
          aria-label="Upload a photo"
          className={css.userPhoto}
          loading="lazy"
          width="75"
          height="75"
        />
        <label htmlFor="userImage" className={css.uploadButton}>
          <svg>
            <use href="/src/assets/icons/sprite.svg#icon-upload"></use>
          </svg>
          Upload a photo
        </label>
      </div>

      <div className={css.wrapperDesktopFlex}>
        <div className={css.wrapperFrame}>
          <fieldset aria-labelledby="gender">
            <legend id="gender" className={css.labelGender}>
              Your gender identity
            </legend>
            <div className={css.radioWrapper}>
              <div className={css.radioContainer}>
                <input
                  type="radio"
                  id="radioWoman"
                  value="female"
                  className={css.radio}
                  {...register('gender')}
                />
                <label htmlFor="radioWoman" className={css.hiddenLabel}>
                  Woman
                </label>
              </div>
              <div className={css.radioContainer}>
                <input
                  type="radio"
                  id="radioMan"
                  value="male"
                  className={css.radio}
                  {...register('gender')}
                />
                <label htmlFor="radioMan" className={css.hiddenLabel}>
                  Man
                </label>
              </div>
            </div>
            {errors.gender && (
              <p className={css.error} aria-live="assertive">
                {errors.gender.message}
              </p>
            )}
          </fieldset>
          <div className={css.gap}>
            <div className={css.wrapper}>
              <label htmlFor="userName" className={css.label}>
                Your name
              </label>
              <input
                type="text"
                id="userName"
                name="userName"
                className={css.userInput}
                placeholder="Nadia"
                autoComplete="name"
                {...register('userName')}
              />
              {errors.userName && (
                <p className={css.error} aria-live="assertive">
                  {errors.userName.message}
                </p>
              )}
            </div>
            <div className={css.wrapper}>
              <label
                htmlFor="userEmail"
                className={`${css.label} ${css.retreatBottom}`}
              >
                Email
              </label>
              <input
                type="email"
                id="userEmail"
                name="userEmail"
                className={css.userInput}
                placeholder="nadia10@gmail.com"
                autoComplete="email"
                {...register('userEmail')}
              />
              {errors.userEmail && (
                <p className={css.error} aria-live="assertive">
                  {errors.userEmail.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <h2 className={css.subtitle}>My daily norma</h2>
            <div className={css.wrapperText}>
              <p className={css.text}>
                For woman:
                <span className={css.textAccent}>V=(M*0,03) + (T*0,4)</span>
              </p>
              <p className={css.text}>
                For man:
                <span className={css.textAccent}>V=(M*0,04) + (T*0,6)</span>
              </p>
            </div>
            <p className={css.textDescription}>
              <span className={css.textAccent}>*</span> V is the volume of the
              water norm in liters per day, M is your body weight, T is the time
              of active sports, or another type of activity commensurate in
              terms of loads (in the absence of these, you must set 0)
            </p>
            <p className={css.textActiveTime}>
              <span className={css.mark}>!</span>Active time in hours
            </p>
          </div>
        </div>

        <div className={css.wrapperFrameTwo}>
          <div className={`${css.wrapperInput} ${css.retreat}`}>
            <label htmlFor="userWeight" className={css.labelRegularly}>
              Your weight in kilograms:
            </label>
            <input
              type="text"
              id="userWeight"
              name="userWeight"
              placeholder="0"
              autoComplete="off"
              className={css.userInput}
              {...register('userWeight')}
            />
          </div>
          <div className={css.wrapperInput}>
            <label htmlFor="userTime" className={css.labelRegularly}>
              The time of active participation in sports:
            </label>
            <input
              type="text"
              id="userTime"
              name="userTime"
              placeholder="0"
              autoComplete="off"
              className={css.userInput}
              {...register('userTime')}
            />
          </div>
          <div className={css.wrapperWaterAmount}>
            <p className={css.labelRegularlyWaterAmount}>
              The required amount of water in liters per day:
            </p>
            <p className={css.accent}> 1.8L</p>
          </div>
          <div className={css.wrapperInput}>
            <label htmlFor="dailyRequirement" className={css.labelWaterNorma}>
              Write down how much water you will drink:
            </label>
            <input
              type="text"
              id="dailyRequirement"
              name="dailyRequirement"
              placeholder="1.8"
              autoComplete="off"
              className={css.userInput}
              {...register('dailyRequirement')}
            />
          </div>
        </div>
      </div>

      <button type="submit" className={css.subButton}>
        Save
      </button>
    </form>
  );
};

export default UserSettingsForm;
