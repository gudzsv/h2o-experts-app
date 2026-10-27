import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from 'react-modal';
import { onActivate } from '../../helpers/a11y';
import styles from '../Modal/Modal.module.css';

Modal.setAppElement('#root');

export const ModalTemplate = ({
  modalIsOpen,
  closeModal,
  isSettings,
  children,
}) => {
  const { t } = useTranslation();

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
          onKeyDown={onActivate(closeModal)}
          role="button"
          tabIndex={0}
          aria-label={t('a11y.closeModal')}
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
