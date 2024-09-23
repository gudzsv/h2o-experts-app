import css from './ResetPwdForm.module.css';

import { useId, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import sprite from '../../assets/icons/sprite.svg';

import { resetPwd } from '../../redux/auth/operations';

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Password must contain at least 6 characters')
    .required('Required'),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Required'),
});

const ResetPwdForm = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const passwordId = useId();
  const repeatPasswordId = useId();

  const url = new URL(window.location.href);
  const token = url.searchParams.get('token');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      password: '',
      repeatPassword: '',
    },
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = data => {
    const { password } = data;
    dispatch(resetPwd({ token, password }));
    reset();
  };

  return (
    <>
      <form className={css.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={css.wrapperContent}>
          <div className={css.wrapperInput}>
            <label htmlFor={passwordId} className={css.label}>
              {t('resetPwd.password')}
            </label>
            <div className={css.inputWrapper}>
              <input
                id={passwordId}
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder={t('resetPwd.placeholderPassword')}
                className={`${css.input} ${
                  errors.password ? css.errorInput : ''
                }`}
              />
              <svg
                className={css.icon}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                role="button"
              >
                <use
                  width={20}
                  height={20}
                  href={`${sprite}${
                    showPassword ? '#icon-eye' : '#icon-eye-off'
                  }`}
                ></use>
              </svg>
            </div>
            {errors.password && (
              <div className={css.error}>{errors.password.message}</div>
            )}
          </div>
          <div className={css.wrapperInput}>
            <label htmlFor={repeatPasswordId} className={css.label}>
              {t('resetPwd.password')}
            </label>
            <div className={css.inputWrapper}>
              <input
                id={repeatPasswordId}
                {...register('repeatPassword')}
                type={showRepeatPassword ? 'text' : 'password'}
                placeholder={t('resetPwd.placeholderRepeatPassword')}
                className={`${css.input} ${
                  errors.repeatPassword ? css.errorInput : ''
                }`}
              />
              <svg
                className={css.icon}
                onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                aria-label={
                  showRepeatPassword ? 'Hide password' : 'Show password'
                }
                role="button"
              >
                <use
                  width={20}
                  height={20}
                  href={`${sprite}${
                    showRepeatPassword ? '#icon-eye' : '#icon-eye-off'
                  }`}
                ></use>
              </svg>
            </div>
            {errors.repeatPassword && (
              <div className={css.error}>{errors.repeatPassword.message}</div>
            )}
          </div>
        </div>
        <button
          type="submit"
          className={css.btn}
          aria-label="Sign up button for an account"
        >
          {t('resetPwd.title')}
        </button>
      </form>
    </>
  );
};

export default ResetPwdForm;
