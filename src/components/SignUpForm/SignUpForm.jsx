import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useId } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import styles from './SignUpForm.module.css';
import sprite from '../../assets/icons/sprite.svg';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Must be a valid email').required('Required'),
  password: Yup.string()
    .min(6, 'Password must contain at least 6 characters')
    .required('Required'),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Required'),
});

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const emailId = useId();
  const passwordId = useId();
  const repeatPasswordId = useId();

  const {
    register,
    handleSubmit,
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

  const onSubmit = data => {
    console.log(data);
    toast.success('Registration successful 🤗');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.wrapperContent}>
        <div className={styles.wrapperInpt}>
          <label htmlFor={emailId} className={styles.label}>
            Email
          </label>
          <input
            id={emailId}
            {...register('email')}
            type="email"
            placeholder="Enter your email"
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
            Password
          </label>
          <div className={styles.inputWrapper}>
            <input
              id={passwordId}
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
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
                xlinkHref={`${sprite}${
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
            Repeat password
          </label>
          <div className={styles.inputWrapper}>
            <input
              id={repeatPasswordId}
              {...register('repeatPassword')}
              type={showRepeatPassword ? 'text' : 'password'}
              placeholder="Repeat password"
              className={`${styles.input} ${
                errors.repeatPassword ? styles.errorInpt : ''
              }`}
            />
            <svg
              className={styles.icon}
              onClick={() => setShowRepeatPassword(!showRepeatPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              role="button"
            >
              <use
                width={20}
                height={20}
                xlinkHref={`${sprite}${
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
      <button
        type="submit"
        className={styles.btn}
        aria-label="Sign up button for an account"
      >
        Sign Up
      </button>
    </form>
  );
};

export default SignUpForm;
