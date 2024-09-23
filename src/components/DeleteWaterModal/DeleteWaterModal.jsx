import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteWater } from '../../redux/water/operations';
import { ModalTemplate } from '../Modal/Modal';
import css from './DeleteWaterModal.module.css';

export const DeleteWaterModal = React.memo(
  ({ id, modalIsOpen, closeModal }) => {
    const dispatch = useDispatch();

    const handleDelete = async () => {
      const response = await dispatch(deleteWater(id));
      if (response.meta.requestStatus === 'fulfilled') {
        closeModal();
      }
    };

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
              Delete entry
            </h2>
            <p id="deleteModalDescription" className={css.qModDel}>
              Are you sure you want to delete the entry?
            </p>
          </div>
          <div className={css.deleteWaterModalBtn}>
            <button
              type="button"
              className={css.deleteButtonModal}
              onClick={handleDelete}
              aria-label="Confirm delete"
            >
              Delete
            </button>
            <button
              type="button"
              className={css.cancelButtonModal}
              onClick={closeModal}
              aria-label="Cancel delete"
            >
              Cancel
            </button>
          </div>
        </div>
      </ModalTemplate>
    );
  }
);

DeleteWaterModal.displayName = 'DeleteWaterModal';
export default DeleteWaterModal;
