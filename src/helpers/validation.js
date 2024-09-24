import * as Yup from 'yup';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const EMAIL_VALIDATION = Yup.string()
  .matches(EMAIL_REGEX, {
    message: 'Must be a valid email',
    excludeEmptyString: true,
  })
  .required('Required');

const PASSWORD_VALIDATION = Yup.string()
  .required('Required')
  .min(6, 'Password must contain at least 6 characters');

export const signUpValidationSchema = Yup.object().shape({
  email: EMAIL_VALIDATION,
  password: PASSWORD_VALIDATION,
  repeatPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Required'),
});

export const signInValidationSchema = Yup.object().shape({
  email: EMAIL_VALIDATION,
  password: PASSWORD_VALIDATION,
});
