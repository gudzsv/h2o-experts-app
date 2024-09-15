import UserSettingsForm from 'components/UserSettingsForm/UserSettingsForm';
import css from './UserSettingsModal.module.css';
const UserSettingsModal = () => {
  return (
    <div className={css.wrapper}>
      <h1 className={css.title}>Setting</h1>
      <UserSettingsForm />
    </div>
  );
};

export default UserSettingsModal;
