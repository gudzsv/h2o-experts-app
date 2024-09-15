import { ModalTemplate } from 'components/Modal/Modal';
import { useModal } from 'components/Modal/UseModal';
import UserSettingsModal from 'components/UserSettingsModal/UserSettingsModal';

const HomePage = () => {
  const { modalIsOpen, openModal, closeModal } = useModal();
  const isSettings = true;
  return (
    <div>
      <button onClick={openModal}>Open Modal</button>
      <ModalTemplate
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        isSettings={isSettings}
      >
        <UserSettingsModal />
      </ModalTemplate>
    </div>
  );
};

export default HomePage;
