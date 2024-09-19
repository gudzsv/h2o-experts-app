import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useId } from 'react';
import { useState } from 'react';
import styles from './SignInForm.module.css';
import sprite from '../../assets/icons/sprite.svg';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/auth/operations';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Must be a valid email').required('Required'),
  password: Yup.string()
    .min(6, 'Password must contain at least 6 characters')
    .required('Required'),
});

const SignInForm = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);

  const emailId = useId();
  const passwordId = useId();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = data => {
    dispatch(login(data));
    reset();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.wrapperContent}>
        <div className={styles.wrapperInpt}>
          <label htmlFor={emailId} className={styles.label}>
            {t('signIn.email')}
          </label>
          <input
            id={emailId}
            {...register('email')}
            type="email"
            placeholder={t('signIn.placeholderEmail')}
            className={`${styles.input} ${
              errors.email ? styles.errorInpt : ''
            }`}
          />
          {errors.email && (
            <div className={styles.error}>{errors.email.message}</div>
          )}
        </div>
        <div className={styles.wrapperInpt}>
          <label htmlFor={passwordId} className={styles.label}>
            {t('signIn.password')}
          </label>
          <div className={styles.inputWrapper}>
            <input
              id={passwordId}
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder={t('signIn.placeholderPassword')}
              className={`${styles.input} ${
                errors.password ? styles.errorInpt : ''
              }`}
            />
            <svg
              className={styles.icon}
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
            <div className={styles.error}>{errors.password.message}</div>
          )}
        </div>
      </div>
      <button
        type="submit"
        className={styles.btn}
        aria-label="Sign in button for an account"
      >
        {t('signIn.title')}
      </button>
    </form>
  );
};

export default SignInForm;
