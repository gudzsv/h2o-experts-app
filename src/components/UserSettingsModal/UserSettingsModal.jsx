import UserSettingsForm from 'components/UserSettingsForm/UserSettingsForm';
import css from './UserSettingsModal.module.css';
const UserSettingsModal = () => {
  return (
    <div className={css.wrapper}>
      <h2 className={css.title}>Setting</h2>
      <UserSettingsForm />
    </div>
  );
};

export default UserSettingsModal;
