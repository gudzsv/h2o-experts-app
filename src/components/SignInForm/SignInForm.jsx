import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useEffect, useId } from 'react';
import { useState } from 'react';
import styles from './SignInForm.module.css';
import sprite from '../../assets/icons/sprite.svg';
import { useDispatch, useSelector } from 'react-redux';
import { getOAuthURL, login } from '../../redux/auth/operations';
import { selectOAuthURL } from '../../redux/auth/selectors';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: 'Must be a valid email',
      excludeEmptyString: true,
    })
    .required('Required'),
  password: Yup.string()
    .min(6, 'Password must contain at least 6 characters')
    .required('Required'),
});

const navigate = url => {
  return (window.location.href = url);
};

const SignInForm = () => {
  const dispatch = useDispatch();
  const OAuthURL = useSelector(selectOAuthURL);
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const emailId = useId();
  const passwordId = useId();

  useEffect(() => {
    OAuthURL && navigate(OAuthURL);
  }, [OAuthURL]);

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

  const handleOAuth = () => {
    dispatch(getOAuthURL());
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.wrapperContent}>
          <div className={styles.wrapperInpt}>
            <label htmlFor={emailId} className={styles.label}>
              {t('signIn.email')}
            </label>
            <input
              id={emailId}
              {...register('email')}
              type="text"
              placeholder={t('signIn.placeholderEmail')}
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
        <div className={styles.btnWrapper}>
          <button
            type="submit"
            className={styles.btn}
            aria-label="Sign in button for an account"
          >
            {t('signIn.title')}
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
    </>
  );
};

export default SignInForm;
