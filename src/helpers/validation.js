import * as Yup from 'yup';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const getEmailValidation = t => {
  return Yup.string()
    .matches(EMAIL_REGEX, {
      message: t('validation.emailMessage'),
      excludeEmptyString: true,
    })
    .required(t('validation.requiredMessage'));
};

const getPasswordValidation = t => {
  return Yup.string()
    .required(t('validation.requiredMessage'))
    .min(6, t('validation.passwordMessage'));
};

export const getSignUpValidationSchema = t => {
  return Yup.object().shape({
    email: getEmailValidation(t),
    password: getPasswordValidation(t),
    repeatPassword: Yup.string()
      .oneOf([Yup.ref('password')], t('validation.repeatPasswordMessage'))
      .required(t('validation.requiredMessage')),
  });
};

export const getSignInValidationSchema = t => {
  return Yup.object().shape({
    email: getEmailValidation(t),
    password: getPasswordValidation(t),
  });
};
