import css from './ConfirmResetPwdForm.module.css';

import { useId } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { sendResetEmail } from '../../redux/auth/operations';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Must be a valid email').required('Required'),
});

const ConfirmResetPwdForm = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const emailId = useId();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      email: '',
    },
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = data => {
    dispatch(sendResetEmail(data));
    reset();
  };

  return (
    <>
      <form className={css.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={css.wrapperContent}>
          <div className={css.wrapperInpt}>
            <label htmlFor={emailId} className={css.label}>
              {t('resetPwd.email')}
            </label>
            <input
              id={emailId}
              {...register('email')}
              type="email"
              placeholder={t('resetPwd.email')}
              className={`${css.input} ${errors.email ? css.errorInpt : ''}`}
            />
            {errors.email && (
              <div className={css.error}>{errors.email.message}</div>
            )}
          </div>
          <button
            type="submit"
            className={css.btn}
            aria-label="Confirm reset password button for an account"
          >
            {t('resetPwd.title')}
          </button>
        </div>
      </form>
    </>
  );
};

export default ConfirmResetPwdForm;
