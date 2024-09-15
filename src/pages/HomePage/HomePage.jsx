import { ModalTemplate } from 'components/Modal/Modal.jsx';
import { useModal } from 'components/Modal/UseModal.jsx';
import WaterModal from 'components/WaterModal/WaterModal.jsx';

const HomePage = () => {
  const { modalIsOpen, openModal, closeModal, modalProps } = useModal();

  return (
    <>
      <button onClick={() => openModal({ add: true })}>add</button>
      <button onClick={() => openModal({ edit: true })}>edit</button>

      <ModalTemplate modalIsOpen={modalIsOpen} closeModal={closeModal}>
        <WaterModal {...modalProps} />
      </ModalTemplate>
    </>
  );
};

export default HomePage;
