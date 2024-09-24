import UserSettingsForm from 'components/UserSettingsForm/UserSettingsForm';
import css from './UserSettingsModal.module.css';
import { ModalTemplate } from 'components/Modal/Modal';
import { useTranslation } from 'react-i18next';

const UserSettingsModal = ({ modalIsOpen, onClose }) => {
  const { t } = useTranslation();
  return (
    <ModalTemplate modalIsOpen={modalIsOpen} closeModal={onClose}>
      <div className={css.wrapper} role="dialog" aria-labelledby="modalTitle">
        <h2 className={css.title} id="modalTitle">
          {t('settingsModal.titleModal')}
        </h2>
        <UserSettingsForm />
      </div>
    </ModalTemplate>
  );
};

export default UserSettingsModal;
