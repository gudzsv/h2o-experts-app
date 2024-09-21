import { useDispatch } from 'react-redux';
import { deleteWater } from '../../redux/water/operations';
import toast from 'react-hot-toast';
import { ModalTemplate } from '../Modal/Modal';
import css from './DeleteWaterModal.module.css';

export const DeleteWaterModal = ({ id, modalIsOpen, closeModal }) => {
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      const response = await dispatch(deleteWater(id));
      if (response.meta.requestStatus === 'fulfilled') {
        closeModal();
      } else {
        throw new Error('Failed to delete');
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error('Не удалось удалить запись. Попробуйте снова.');
    }
  };

  return (
    <ModalTemplate modalIsOpen={modalIsOpen} closeModal={closeModal}>
      <div className={css["delete-water-modal-content"]}>
        <div>
          <h2 className={css["mod-delete"]}>Delete entry</h2>
          <p className={css["q-mod-del"]}>Are you sure you want to delete the entry?</p>
        </div>
        <div className={css["delete-water-modal-btn"]}>
          <button type="button" className={css["delete-button-modal"]} onClick={handleDelete}>Delete</button>
          <button type="button" className={css["cancel-button-modal"]} onClick={closeModal}>Cancel</button>
        </div>
      </div>
    </ModalTemplate>
  );
};

export default DeleteWaterModal;