
import { useState } from 'react';
// import { useDispatch } from 'react-redux';
import css from './WaterItem.module.css';
import sprite from '../../assets/icons/sprite.svg';
import DeleteWaterModal from 'components/DeleteWaterModal/DeleteWaterModal.jsx';
// import { deleteWater } from '../../redux/water/operations';
import { useTranslation } from 'react-i18next';
import { useModal } from 'components/Modal/UseModal';

const WaterItem = ({ item, onEdit /*onDelete*/ }) => {
  const { t } = useTranslation();

  const formattedTime = new Date(item.drinkingTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // const dispatch = useDispatch();

   const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };
  
  // const confirmDelete = () => {
  //   dispatch(deleteWater(item._id));
  //   setIsDeleteModalOpen(false);
  //   if (onDelete) {
  //     onDelete(item._id);
  //   }
  // };

  return (
    <div className={css.water_item}>
      <svg width="38" height="38" className={css.glass}>
        <use href={`${sprite}#icon-water-glass-fill`}></use>
      </svg>
      <div className={css.water_item_content}>
        <span className={css.water_amount}>
          {item.usedWater} {t('chooseDate.ml')}
        </span>
        <span className={css.water_time}>{formattedTime}</span>
      </div>
      <div className={css.water_item_actions}>
        <button
          className={css.edit_btn}
          onClick={onEdit}
          aria-label={t('chooseDate.edit')}
        >
          <svg width="14" height="14" className={css.pencil}>
            <use href={`${sprite}#icon-edit`}></use>
          </svg>
        </button>

        <button
          className={css.delete_btn}
          onClick={handleDelete}
          aria-label="Delete water entry"
        >
          <svg width="14" height="14" className={css.trash}>
            <use href={`${sprite}#icon-trash`}></use>
          </svg>
        </button>

        {isDeleteModalOpen && (
          <DeleteWaterModal
            modalIsOpen={isDeleteModalOpen}
            id={item._id}
            closeModal={closeDeleteModal}
          />

        )}
      </div>
    </div>
  );
};

export default WaterItem;
