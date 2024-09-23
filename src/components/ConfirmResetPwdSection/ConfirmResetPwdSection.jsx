import css from './ConfirmResetPwdSection.module.css';
import { useTranslation } from 'react-i18next';
import Logo from 'components/Logo/Logo';
import ConfirmResetPwdForm from 'components/ConfirmResetPwdForm/ConfirmResetPwdForm.jsx';

const ConfirmResetPwdSection = () => {
  const { t } = useTranslation();
  return (
    <section className={css.section}>
      <Logo />
      <div className={css.formWrapper}>
        <h2 className={css.title} aria-label="Confirm reset password">
          {t('resetPwd.title')}
        </h2>
        <ConfirmResetPwdForm />
      </div>
    </section>
  );
};

export default ConfirmResetPwdSection;
