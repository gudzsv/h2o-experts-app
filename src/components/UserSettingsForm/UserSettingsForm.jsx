import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import css from './UserSettingsForm.module.css';
import * as Yup from 'yup';
import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editUser } from '../../redux/auth/operations';
import { selectUser } from '../../redux/auth/selectors';
import { useTranslation } from 'react-i18next';

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

const UserSettingsForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    email,
    name,
    gender,
    weight,
    activityLevel,
    dailyRequirement,
    photo,
  } = useSelector(selectUser);

  const [imagePreview, setImagePreview] = useState(photo);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSettingsValidationSchema),
    defaultValues: {
      userEmail: email,
      userImage: photo,
      gender: gender,
      userName: name,
      userWeight: weight,
      userTime: activityLevel,
      dailyRequirement: dailyRequirement,
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
      if (data.userImage && data.userImage instanceof File) {
        formData.append('photo', data.userImage);
      }
      dispatch(editUser(formData));
      onClose(false);
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
          alt={t('settingsForm.userPhotoAlt')}
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
          {t('settingsForm.userUploadButton')}
        </label>
      </div>

      <div className={css.wrapperDesktopFlex}>
        <div className={css.wrapperFrame}>
          <fieldset aria-labelledby="gender">
            <legend id="gender" className={css.labelGender}>
              {t('settingsForm.userGender')}
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
                  {t('settingsForm.genderWoman')}
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
                  {t('settingsForm.genderMan')}
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
                {t('settingsForm.userNameLabel')}
              </label>
              <input
                type="text"
                id="userName"
                name="userName"
                className={css.userInput}
                placeholder={t('settingsForm.userNamePlaceholder')}
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
                {t('settingsForm.userEmailLabel')}
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
            <h2 className={css.subtitle}>{t('settingsForm.subtitle')}</h2>
            <div className={css.wrapperText}>
              <p className={css.text}>
                {t('settingsForm.textForWoman')}
                <span className={css.textAccent}>V=(M*0,03) + (T*0,4)</span>
              </p>
              <p className={css.text}>
                {t('settingsForm.textForMan')}
                <span className={css.textAccent}>V=(M*0,04) + (T*0,6)</span>
              </p>
            </div>
            <p className={css.textDescription}>
              <span className={css.textAccent}>*</span>
              {t('settingsForm.textDescription')}
            </p>
            <p className={css.textActiveTime}>
              <span className={css.mark}>!</span>
              {t('settingsForm.textActiveTime')}
            </p>
          </div>
        </div>

        <div className={css.wrapperFrameTwo}>
          <div className={`${css.wrapperInput} ${css.retreat}`}>
            <label htmlFor="userWeight" className={css.labelRegularly}>
              {t('settingsForm.userWeight')}
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
              {t('settingsForm.userTime')}
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
              {t('settingsForm.WaterAmount')}
            </p>
            <p className={css.accent}> 1.8L</p>
          </div>
          <div className={css.wrapperInput}>
            <label htmlFor="dailyRequirement" className={css.labelWaterNorma}>
              {t('settingsForm.labelWaterNorma')}
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
        {t('settingsForm.subButton')}
      </button>
    </form>
  );
};

export default UserSettingsForm;
