import UserSettingsForm from 'components/UserSettingsForm/UserSettingsForm';
import css from './UserSettingsModal.module.css';
const UserSettingsModal = () => {
  return (
    <div className={css.wrapper} role="dialog" aria-labelledby="modalTitle">
      <h2 className={css.title} id="modalTitle">
        Setting
      </h2>
      <UserSettingsForm />
    </div>
  );
};

export default UserSettingsModal;
