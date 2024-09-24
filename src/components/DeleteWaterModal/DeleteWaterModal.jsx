import React from 'react';
import { ModalTemplate } from '../Modal/Modal';
import css from './DeleteWaterModal.module.css';
import { useTranslation } from 'react-i18next';

export const DeleteWaterModal = React.memo(
  ({ modalIsOpen, handleDelete, closeModal }) => {
    const { t } = useTranslation();
    return (
      <ModalTemplate modalIsOpen={modalIsOpen} closeModal={closeModal}>
        <div
          className={css.deleteWaterModalContent}
          role="dialog"
          aria-labelledby="deleteModalTitle"
          aria-describedby="deleteModalDescription"
        >
          <div>
            <h2 id="deleteModalTitle" className={css.modDelete}>
              {t('deleteModal.title')}
            </h2>
            <p id="deleteModalDescription" className={css.qModDel}>
              {t('deleteModal.confirm')}
            </p>
          </div>
          <div className={css.deleteWaterModalBtn}>
            <button
              type="button"
              className={css.deleteButtonModal}
              onClick={handleDelete}
              aria-label={t('deleteModal.ariaDelete')}
            >
              {t('deleteModal.delete')}
            </button>
            <button
              type="button"
              className={css.cancelButtonModal}
              onClick={closeModal}
              aria-label={t('deleteModal.ariaClose')}
            >
              {t('deleteModal.close')}
            </button>
          </div>
        </div>
      </ModalTemplate>
    );
  }
);

DeleteWaterModal.displayName = 'DeleteWaterModal';
export default DeleteWaterModal;
