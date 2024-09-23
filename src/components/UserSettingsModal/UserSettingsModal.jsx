import UserSettingsForm from 'components/UserSettingsForm/UserSettingsForm';
import css from './UserSettingsModal.module.css';
import { ModalTemplate } from 'components/Modal/Modal';

const UserSettingsModal = ({ modalIsOpen, onClose }) => {
  return (
    <ModalTemplate modalIsOpen={modalIsOpen} closeModal={onClose}>
      <div className={css.wrapper} role="dialog" aria-labelledby="modalTitle">
        <h2 className={css.title} id="modalTitle">
          Setting
        </h2>
        <UserSettingsForm />
      </div>
    </ModalTemplate>
  );
};

export default UserSettingsModal;
