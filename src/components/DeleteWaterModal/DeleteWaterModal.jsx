import { useDispatch } from 'react-redux';
import { deleteWater } from '../../redux/water/operations';
import { ModalTemplate } from '../Modal/Modal';
import css from './DeleteWaterModal.module.css';

export const DeleteWaterModal = ({ id, modalIsOpen, closeModal }) => {
  const dispatch = useDispatch();

  const handleDelete = async () => {
  const response = await dispatch(deleteWater(id));
  if (response.meta.requestStatus === 'fulfilled') {
    closeModal();
  }
};

  return (
    <ModalTemplate modalIsOpen={modalIsOpen} closeModal={closeModal}>
      <div className={css.deleteWaterModalContent}>
        <div>
          <h2 className={css.modDelete}>Delete entry</h2>
          <p className={css.qModDel}>
            Are you sure you want to delete the entry?
          </p>
        </div>
        <div className={css.deleteWaterModalBtn}>
          <button type="button" className={css.deleteButtonModal} onClick={handleDelete}>Delete</button>
          <button type="button" className={css.cancelButtonModal} onClick={closeModal}>Cancel</button>
        </div>
      </div>
    </ModalTemplate>
  );
};

export default DeleteWaterModal;
