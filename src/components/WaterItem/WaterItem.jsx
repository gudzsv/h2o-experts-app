import css from './WaterItem.module.css';

const WaterItem = ({ item, onEdit, onDelete }) => {
  return (
    <div className={css.water_item}>
      <svg width="38" height="38" className={css.glass}>
        <use href="/src/assets/icons/sprite.svg#icon-water-glass-fill"></use>
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
            <use href="/src/assets/icons/sprite.svg#icon-edit"></use>
          </svg>
        </button>
        <button
          className={css.delete_btn}
          onClick={onDelete}
          aria-label="Delete water entry"
        >
          <svg width="14" height="14" className={css.trash}>
            <use href="/src/assets/icons/sprite.svg#icon-trash"></use>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default WaterItem;
