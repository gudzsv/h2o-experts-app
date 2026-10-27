import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ModalTemplate } from 'components/Modal/Modal';
import { editUser } from '../../redux/auth/operations';
import { selectUser } from '../../redux/auth/selectors';
import { calculateDailyNormLiters } from '../../helpers/dailyNorm.js';
import { mlToOz, normalizeUnits, UNITS } from '../../helpers/units.js';
import { skipOnboarding } from '../../helpers/onboarding.js';
import css from './OnboardingModal.module.css';

const OnboardingModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const user = useSelector(selectUser);

  const schema = Yup.object().shape({
    gender: Yup.string().required(),
    units: Yup.string().required(),
    weight: Yup.number()
      .typeError(t('settingsForm.ValidationWeightTypeError'))
      .min(1, t('settingsForm.ValidationWeightMin'))
      .required(t('settingsForm.ValidationWeightRequired')),
    activity: Yup.number()
      .typeError(t('settingsForm.ValidationTimeTypeError'))
      .min(0, t('onboarding.activityMin'))
      .required(t('settingsForm.ValidationTimeRequired')),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    resolver: yupResolver(schema),
    defaultValues: {
      gender: user.gender ?? 'female',
      units: normalizeUnits(user.units),
      weight: '',
      activity: '0',
    },
  });

  const [gender, weight, activity, units] = watch([
    'gender',
    'weight',
    'activity',
    'units',
  ]);
  const isOz = units === UNITS.OZ;
  const liters = calculateDailyNormLiters(gender, weight, activity);
  const isReady = liters !== null && liters > 0 && Number(weight) >= 1;
  const normMl = isReady ? Math.round(liters * 1000) : null;

  const close = () => onClose(false);

  const handleSkip = () => {
    skipOnboarding(user.email);
    close();
  };

  const onSubmit = data => {
    const formData = new FormData();
    formData.append('gender', data.gender);
    formData.append('weight', data.weight);
    formData.append('activityLevel', data.activity);
    formData.append('units', data.units);
    formData.append('dailyRequirement', normMl);
    dispatch(editUser(formData));
    close();
  };

  return (
    <ModalTemplate modalIsOpen={isOpen} closeModal={handleSkip}>
      <form
        className={css.wrapper}
        role="dialog"
        aria-labelledby="onboardingTitle"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className={css.title} id="onboardingTitle">
          {t('onboarding.title')}
        </h2>
        <p className={css.text}>{t('onboarding.text')}</p>

        <fieldset className={css.fieldset}>
          <legend className={css.label}>{t('settingsForm.userGender')}</legend>
          <div className={css.radios}>
            <label className={css.radio}>
              <input type="radio" value="female" {...register('gender')} />
              {t('settingsForm.genderWoman')}
            </label>
            <label className={css.radio}>
              <input type="radio" value="male" {...register('gender')} />
              {t('settingsForm.genderMan')}
            </label>
          </div>
        </fieldset>

        <fieldset className={css.fieldset}>
          <legend className={css.label}>{t('units.legend')}</legend>
          <div className={css.radios}>
            <label className={css.radio}>
              <input type="radio" value="ml" {...register('units')} />
              {t('units.ml')}
            </label>
            <label className={css.radio}>
              <input type="radio" value="oz" {...register('units')} />
              {t('units.oz')}
            </label>
          </div>
        </fieldset>

        <div className={css.field}>
          <label htmlFor="onboardingWeight" className={css.label}>
            {t('settingsForm.userWeight')}
          </label>
          <input
            id="onboardingWeight"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder="0"
            className={css.input}
            {...register('weight')}
          />
          {errors.weight && (
            <p className={css.error} aria-live="assertive">
              {errors.weight.message}
            </p>
          )}
        </div>

        <div className={css.field}>
          <label htmlFor="onboardingActivity" className={css.label}>
            {t('settingsForm.userTime')}
          </label>
          <input
            id="onboardingActivity"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder="0"
            className={css.input}
            {...register('activity')}
          />
          {errors.activity && (
            <p className={css.error} aria-live="assertive">
              {errors.activity.message}
            </p>
          )}
        </div>

        <p className={css.result} aria-live="polite">
          {t('onboarding.yourNorm')}{' '}
          <span className={css.accent}>
            {isReady
              ? isOz
                ? `${Math.round(mlToOz(normMl))} ${t('units.oz')}`
                : `${normMl} ${t('units.ml')}`
              : '—'}
          </span>
        </p>

        <div className={css.actions}>
          <button type="submit" className={css.save} disabled={!isReady}>
            {t('onboarding.save')}
          </button>
          <button type="button" className={css.skip} onClick={handleSkip}>
            {t('onboarding.skip')}
          </button>
        </div>
      </form>
    </ModalTemplate>
  );
};

export default OnboardingModal;
