import css from './WaterItem.module.css';
import sprite from '../../assets/icons/sprite.svg';
import DeleteWaterModal from 'components/DeleteWaterModal/DeleteWaterModal';
import { useState } from 'react';
import { deleteWater } from '../../redux/water/operations';
import { useDispatch } from 'react-redux';

const WaterItem = ({ item, onEdit }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dispatch = useDispatch();

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    dispatch(deleteWater(item.id));
    setIsDeleteModalOpen(false);
  };

  return (
    <div className={css.water_item}>
      <svg width="38" height="38" className={css.glass}>
        <use href={sprite + '#icon-water-glass-fill'}></use>
      </svg>
      <div className={css.water_item_content}>
        <span className={css.water_amount}>{item.amount} ml</span>
        <span className={css.water_time}>{item.time}</span>
      </div>
      <div className={css.water_item_actions}>
        <button
          className={css.edit_btn}
          onClick={onEdit}
          aria-label="Edit water entry"
        >
          <svg width="14" height="14" className={css.pencil}>
            <use href={sprite + '#icon-edit'}></use>
            {/* <use href="/src/assets/icons/sprite.svg#icon-edit"></use> */}
          </svg>
        </button>
        <button
          className={css.delete_btn}
          onClick={handleDelete}
          aria-label="Delete water entry"
        >
          <svg width="14" height="14" className={css.trash}>
            <use href={sprite + '#icon-trash'}></use>
            {/* <use href="/src/assets/icons/sprite.svg#icon-trash"></use> */}
          </svg>
        </button>
      </div>

      {isDeleteModalOpen && (
        <DeleteWaterModal
          id={item.id}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default WaterItem;
