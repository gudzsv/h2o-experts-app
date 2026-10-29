import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import css from './UserSettingsForm.module.css';
import * as Yup from 'yup';
import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editUser } from '../../redux/auth/operations';
import { selectUser } from '../../redux/auth/selectors';
import { useTranslation } from 'react-i18next';
import { calculateDailyNormLiters } from '../../helpers/dailyNorm.js';
import { mlToOz, normalizeUnits, UNITS } from '../../helpers/units.js';
import { getInitialNormField, useDailyNorm } from './useDailyNorm.js';

import avatarMobile1x from '../../assets/img/settings_avatar/settings_avatar_mob_1x.webp';
import avatarMobile2x from '../../assets/img/settings_avatar/settings_avatar_mob_2x.webp';
import sprite from '../../assets/icons/sprite.svg';

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
    units: savedUnits,
  } = useSelector(selectUser);
  const initialUnits = normalizeUnits(savedUnits);
  const userName = !name || name === 'User' ? email?.split('@')[0] : name;

  const [imagePreview, setImagePreview] = useState(photo);

  const userSettingsValidationSchema = Yup.object().shape({
    userImage: Yup.mixed(),
    gender: Yup.string().required(t('settingsForm.ValidationGender')),
    userName: Yup.string()
      .min(3, t('settingsForm.ValidationNameMin'))
      .max(50, t('settingsForm.ValidationNameMax'))
      .required(t('settingsForm.ValidationNameRequired')),
    userEmail: Yup.string()
      .email(t('settingsForm.ValidationEmail'))
      .required(t('settingsForm.ValidationEmailRequired')),
    userWeight: Yup.number()
      .typeError(t('settingsForm.ValidationWeightTypeError'))
      .min(1, t('settingsForm.ValidationWeightMin'))
      .required(t('settingsForm.ValidationWeightRequired')),
    userTime: Yup.number()
      .typeError(t('settingsForm.ValidationTimeTypeError'))
      .min(0, t('settingsForm.ValidationTimeMin'))
      .required(t('settingsForm.ValidationTimeRequired')),
    dailyRequirement: Yup.number()
      .typeError(t('settingsForm.ValidationDailyRequirementTypeError'))
      .min(1, t('settingsForm.ValidationDailyRequirementMin'))
      .required(t('settingsForm.ValidationDailyRequirementRequired')),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    resolver: yupResolver(userSettingsValidationSchema),
    defaultValues: {
      userEmail: email,
      userImage: photo,
      gender: gender,
      userName: userName,
      userWeight: weight,
      userTime: activityLevel,
      units: initialUnits,
      dailyRequirement: getInitialNormField(dailyRequirement, initialUnits),
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

  const genderValue = watch('gender');
  const weightValue = watch('userWeight');
  const timeValue = watch('userTime');
  const unitsValue = normalizeUnits(watch('units'));
  const isOz = unitsValue === UNITS.OZ;

  const { normMl, handleNormChange, applyNormMl } = useDailyNorm({
    dailyRequirement,
    initialUnits,
    unitsValue,
    setValue,
  });
  const recommendedLiters = calculateDailyNormLiters(
    genderValue,
    weightValue,
    timeValue
  );
  const canUseRecommended = recommendedLiters !== null && recommendedLiters > 0;

  const onSubmitForm = useCallback(
    async data => {
      const formData = new FormData();
      formData.append('name', data.userName);
      formData.append('gender', data.gender);
      formData.append('email', data.userEmail || '');
      formData.append('weight', data.userWeight || 0);
      formData.append('activityLevel', data.userTime || 0);
      formData.append('dailyRequirement', normMl || 0);
      formData.append('units', data.units);
      if (data.userImage && data.userImage instanceof File) {
        formData.append('photo', data.userImage);
      }
      dispatch(editUser(formData));
      onClose(false);
    },
    [dispatch, onClose, normMl]
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
          src={imagePreview || avatarMobile1x}
          srcSet={
            imagePreview
              ? `${imagePreview}`
              : `${avatarMobile1x} 1x, ${avatarMobile2x} 2x`
          }
          alt={t('settingsForm.userPhotoAlt')}
          className={css.userPhoto}
          loading="lazy"
          width="75"
          height="75"
        />
        <label htmlFor="userImage" className={css.uploadButton}>
          <svg>
            <use href={`${sprite}#icon-upload`}></use>
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
                className={`${css.userInput} ${
                  errors.userName ? css.errorInput : ''
                }`}
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
                className={`${css.userInput} ${
                  errors.userEmail ? css.errorInput : ''
                }`}
                placeholder="example@email.com"
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
              className={`${css.userInput} ${
                errors.userWeight ? css.errorInput : ''
              }`}
              {...register('userWeight')}
            />
            {errors.userWeight && (
              <p className={css.error} aria-live="assertive">
                {errors.userWeight.message}
              </p>
            )}
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
              className={`${css.userInput} ${
                errors.userTime ? css.errorInput : ''
              }`}
              {...register('userTime')}
            />
            {errors.userTime && (
              <p className={css.error} aria-live="assertive">
                {errors.userTime.message}
              </p>
            )}
          </div>
          <div className={css.wrapperWaterAmount}>
            <p className={css.labelRegularlyWaterAmount}>
              {isOz
                ? t('settingsForm.WaterAmountOz')
                : t('settingsForm.WaterAmount')}
            </p>
            <p className={css.accent}>
              {recommendedLiters === null
                ? '0.00'
                : isOz
                ? Math.round(mlToOz(recommendedLiters * 1000))
                : recommendedLiters.toFixed(1)}
              {isOz ? ` ${t('units.oz')}` : 'L'}
            </p>
          </div>
          <button
            type="button"
            className={css.recommendedButton}
            disabled={!canUseRecommended}
            onClick={() => applyNormMl(Math.round(recommendedLiters * 1000))}
          >
            {t('settingsForm.useRecommended')}
          </button>
          <fieldset aria-labelledby="units" className={css.unitsFieldset}>
            <legend id="units" className={css.labelGender}>
              {t('units.legend')}
            </legend>
            <div className={css.radioWrapper}>
              <div className={css.radioContainer}>
                <input
                  type="radio"
                  id="radioMl"
                  value="ml"
                  className={css.radio}
                  {...register('units')}
                />
                <label htmlFor="radioMl" className={css.hiddenLabel}>
                  {t('units.ml')}
                </label>
              </div>
              <div className={css.radioContainer}>
                <input
                  type="radio"
                  id="radioOz"
                  value="oz"
                  className={css.radio}
                  {...register('units')}
                />
                <label htmlFor="radioOz" className={css.hiddenLabel}>
                  {t('units.oz')}
                </label>
              </div>
            </div>
          </fieldset>
          <div className={css.wrapperInput}>
            <label htmlFor="dailyRequirement" className={css.labelWaterNorma}>
              {t('settingsForm.labelWaterNorma', {
                unit: isOz ? t('units.oz') : t('units.ml'),
              })}
            </label>
            <input
              type="text"
              id="dailyRequirement"
              name="dailyRequirement"
              autoComplete="off"
              className={`${css.userInput} ${
                errors.dailyRequirement ? css.errorInput : ''
              }`}
              {...register('dailyRequirement', { onChange: handleNormChange })}
            />
            {errors.dailyRequirement && (
              <p className={css.error} aria-live="assertive">
                {errors.dailyRequirement.message}
              </p>
            )}
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
