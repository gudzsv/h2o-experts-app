import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useId } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import styles from './SignUpForm.module.css';

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

  const emailId = useId();
  const passwordId = useId();
  const repeatPasswordId = useId();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
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
      <label htmlFor={emailId} className={styles.label}>
        Email
      </label>
      <input
        id={emailId}
        {...register('email')}
        type="email"
        placeholder="Enter your email"
        className={styles.input}
      />
      {errors.email && (
        <div className={styles.error}>{errors.email.message}</div>
      )}
      <label htmlFor={passwordId} className={styles.label}>
        Password
      </label>
      <input
        id={passwordId}
        {...register('password')}
        type={showPassword ? 'text' : 'password'}
        placeholder="Enter your password"
        className={styles.input}
      />
      {errors.password && (
        <div className={styles.error}>{errors.password.message}</div>
      )}
      <label htmlFor={repeatPasswordId} className={styles.label}>
        Repeat password
      </label>
      <input
        id={repeatPasswordId}
        {...register('repeatPassword')}
        type={showPassword ? 'text' : 'password'}
        placeholder="Repeat password"
        className={styles.input}
      />
      {errors.repeatPassword && (
        <div className={styles.error}>{errors.repeatPassword.message}</div>
      )}
      <button type="submit" className={styles.btn}>
        Sign Up
      </button>
    </form>
  );
};

export default SignUpForm;
