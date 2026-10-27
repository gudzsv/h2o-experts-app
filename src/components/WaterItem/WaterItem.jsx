import { useState } from 'react';
import css from './WaterItem.module.css';
import sprite from '../../assets/icons/sprite.svg';
import DeleteWaterModal from 'components/DeleteWaterModal/DeleteWaterModal.jsx';
import DrinkIcon from 'components/DrinkIcon/DrinkIcon.jsx';
import { useTranslation } from 'react-i18next';
import { getEntryDateKey, toDateKey } from '../../helpers/date.js';
import { useVolume } from '../../hooks/useVolume.js';
import { getDrinkType } from '../../helpers/drinks.js';

const WaterItem = ({ item, onEdit, onDelete, dateForCalendar }) => {
  const { t } = useTranslation();
  const { format } = useVolume();
  const drinkType = getDrinkType(item);

  const formattedTime = new Date(item.drinkingTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);

  const handleOpenModel = () => setIsDeleteModalOpen(true);

  const handleDelete = () => {
    onDelete(item._id);
  };

  if (toDateKey(dateForCalendar) === getEntryDateKey(item)) {
    return (
      <div className={css.water_item}>
        <DrinkIcon
          type={drinkType}
          size={38}
          filled
          className={css.glass}
          label={t(`drinks.${drinkType}`)}
        />
        <div className={css.water_item_content}>
          <span className={css.water_amount}>
            {format(item.usedWater)}
          </span>
          <span className={css.water_time}>{formattedTime}</span>
        </div>
        <div className={css.water_item_actions}>
          <button
            className={css.edit_btn}
            onClick={() => onEdit(item)}
            aria-label={t('chooseDate.edit')}
          >
            <svg width="14" height="14" className={css.pencil}>
              <use href={`${sprite}#icon-edit`}></use>
            </svg>
          </button>

          <button
            className={css.delete_btn}
            onClick={handleOpenModel}
            aria-label={t('a11y.deleteEntry')}
          >
            <svg width="14" height="14" className={css.trash}>
              <use href={`${sprite}#icon-trash`}></use>
            </svg>
          </button>
          {isDeleteModalOpen && (
            <DeleteWaterModal
              modalIsOpen={isDeleteModalOpen}
              handleDelete={handleDelete}
              closeModal={handleCloseDeleteModal}
            />
          )}
        </div>
      </div>
    );
  }
};

export default WaterItem;
