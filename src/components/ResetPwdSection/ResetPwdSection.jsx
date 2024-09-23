import css from './ResetPwdSection.module.css';
import { useTranslation } from 'react-i18next';
import Logo from 'components/Logo/Logo';
import ResetPwdForm from 'components/ResetPwdForm/ResetPwdForm.jsx';

const ResetPwdSection = () => {
  const { t } = useTranslation();
  return (
    <section className={css.section}>
      <Logo />
      <div className={css.formWrapper}>
        <h2 className={css.title} aria-label="Confirm reset password">
          {t('resetPwd.title')}
        </h2>
        <ResetPwdForm />
      </div>
    </section>
  );
};

export default ResetPwdSection;
