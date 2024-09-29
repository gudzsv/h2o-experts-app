import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { useId, useEffect } from 'react';
import { useState } from 'react';
import styles from './SignUpForm.module.css';
import sprite from '../../assets/icons/sprite.svg';
import { getOAuthURL, register as signUp } from '../../redux/auth/operations';
import { useDispatch, useSelector } from 'react-redux';
import { getSignUpValidationSchema } from '../../helpers/validation';
import { selectOAuthURL } from '../../redux/auth/selectors';

const navigate = url => {
  return (window.location.href = url);
};

const SignUpForm = () => {
  const dispatch = useDispatch();
  const OAuthURL = useSelector(selectOAuthURL);
  const { t } = useTranslation();
  const validationSchema = getSignUpValidationSchema(t);

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const emailId = useId();
  const passwordId = useId();
  const repeatPasswordId = useId();

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
      repeatPassword: '',
    },
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    reset();
    OAuthURL && navigate(OAuthURL);
  }, [OAuthURL, t, reset]);

  const onSubmit = data => {
    const { email, password } = data;
    dispatch(signUp({ email, password }));
    reset();
  };

  const handleOAuth = () => {
    dispatch(getOAuthURL());
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.wrapperContent}>
        <div className={styles.wrapperInpt}>
          <label htmlFor={emailId} className={styles.label}>
            {t('signUp.email')}
          </label>
          <input
            id={emailId}
            {...register('email')}
            type="text"
            placeholder={t('signUp.placeholderEmail')}
            className={`${styles.input} ${
              errors.email ? styles.errorInpt : ''
            }`}
            autoComplete="email"
            inputMode="email"
          />
          {errors.email && (
            <div className={styles.error}>{errors.email.message}</div>
          )}
        </div>
        <div className={styles.wrapperInpt}>
          <label htmlFor={passwordId} className={styles.label}>
            {t('signUp.password')}
          </label>
          <div className={styles.inputWrapper}>
            <input
              id={passwordId}
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder={t('signUp.placeholderPassword')}
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
        <div className={styles.wrapperInpt}>
          <label htmlFor={repeatPasswordId} className={styles.label}>
            {t('signUp.password')}
          </label>
          <div className={styles.inputWrapper}>
            <input
              id={repeatPasswordId}
              {...register('repeatPassword')}
              type={showRepeatPassword ? 'text' : 'password'}
              placeholder={t('signUp.placeholderRepeatPassword')}
              className={`${styles.input} ${
                errors.repeatPassword ? styles.errorInpt : ''
              }`}
            />
            <svg
              className={styles.icon}
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
            <div className={styles.error}>{errors.repeatPassword.message}</div>
          )}
        </div>
      </div>

      <div className={styles.btnWrapper}>
        <button
          type="submit"
          className={styles.btn}
          aria-label="Sign up button for an account"
        >
          {t('signUp.title')}
        </button>
        <button
          className={styles.googleBtn}
          type="button"
          onClick={handleOAuth}
          aria-label="Sign in button for an account with Google"
        >
          {t('signIn.googleBtn')}
          <svg className={styles.googleIcon}>
            <use
              href={`${sprite}${'#google-logo'}`}
              width={65}
              height={20}
            ></use>
          </svg>
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;
