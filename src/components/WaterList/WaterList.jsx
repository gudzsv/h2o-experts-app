import css from './WaterList.module.css';
import WaterItem from 'components/WaterItem/WaterItem';
import { ScrollMenu } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';

const WaterList = ({ waterData, onEdit, onDelete }) => {
  return (
    <div>
      <ScrollMenu
        scrollContainerClassName={css.horizontal_scroll_container}
        LeftArrow={false}
        RightArrow={false}
        wheel={true}
      >
        <div className={css.water_list}>
          {waterData.length === 0 ? (
            <p className={css.no_water_text}>
              😰 No water was consumed on this day.
            </p>
          ) : (
            waterData.map(item => (
              <WaterItem
                key={item._id}
                item={item}
                onEdit={() => onEdit(item)}
                onDelete={() => onDelete(item._id)}
              />
            ))
          )}
        </div>
      </ScrollMenu>
    </div>
  );
};

export default WaterList;
