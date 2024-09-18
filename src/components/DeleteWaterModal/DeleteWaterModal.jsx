import { useDispatch } from 'react-redux';
import { deleteWater } from '../../redux/water/operations';
import toast from 'react-hot-toast';
import css from './DeleteWaterModal.module.css';

export const DeleteWaterModal = ({ id, onClose }) => {
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      const response = await dispatch(deleteWater(id));
      if (response.meta.requestStatus === 'fulfilled') {
        onClose();
      } else {
        throw new Error('Failed to delete');
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error('Не удалось удалить запись. Попробуйте снова.');
    }
  };

  return (
    <div className={css["overlay"]} role="dialog" aria-label="delete-modal-title">
      <div className={css["delete-water-modal"]}>
        <button type="button" className={css["close-button-mod"]} onClick={onClose} aria-label="Close">
          <svg className={css["close-icon-mod"]} width="24" height="24">
            <use href='../../assets/icons/sprite.svg#icon-x'></use>
          </svg>
        </button>
        <div className={css["delete-water-modal-content"]}>
          <h2 id="delete-modal-title" className={css["mod-delete"]}>Delete entry</h2>
          <p className={css["q-mod-del"]}>Are you sure you want to delete the entry?</p>
        </div>
        <div className={css["delete-water-modal-btn"]}>
          <button type="button" className={css["delete-button-modal"]} onClick={handleDelete} aria-label="Delete">Delete</button>
          <button type="button" className={css["cancel-button-modal"]} onClick={onClose} aria-label="Cancel"><span className={css["modal-cancel"]}>Cancel</span></button>
        </div>
      </div>
    </div>
  );
};

export default DeleteWaterModal;