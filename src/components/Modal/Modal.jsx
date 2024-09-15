import { useEffect } from 'react';
import Modal from 'react-modal';
import styles from '../Modal/Modal.module.css';

Modal.setAppElement('#root');

export const ModalTemplate = ({
  modalIsOpen,
  closeModal,
  isSettings,
  children,
}) => {
  useEffect(() => {
    if (modalIsOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalIsOpen]);

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      className={styles.content}
      overlayClassName={styles.overlay}
    >
      <div>
        <svg
          className={isSettings ? styles.iconSettings : styles.icon}
          width="28"
          height="28"
          onClick={closeModal}
        >
          <use
            href={`${
              new URL('../../assets/icons/sprite.svg', import.meta.url).href
            }#icon-x`}
          ></use>
        </svg>

        {children}
      </div>
    </Modal>
  );
};
