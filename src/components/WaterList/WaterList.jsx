import css from './WaterList.module.css';
import WaterItem from 'components/WaterItem/WaterItem';
import { ScrollMenu } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import { useTranslation } from 'react-i18next';

const WaterList = ({ waterData, onEdit /*onDelete*/ }) => {
  const { t } = useTranslation();

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
              {t('chooseDate.noWaterConsumed')}
            </p>
          ) : (
            waterData.map(item => (
              <WaterItem
                key={item._id}
                item={item}
                onEdit={() => onEdit(item)}
                // onDelete={() => onDelete(item._id)}
              />
            ))
          )}
        </div>
      </ScrollMenu>
    </div>
  );
};

export default WaterList;
