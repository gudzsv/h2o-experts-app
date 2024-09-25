import { useMemo } from 'react';
import css from './WaterList.module.css';
import WaterItem from 'components/WaterItem/WaterItem';
import { ScrollMenu } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import { useTranslation } from 'react-i18next';

const WaterList = ({ waterData, onEdit, onDelete, dateForCalendar }) => {
  const { t } = useTranslation();

  const normalizeItem = item => {
    const { data, isNew } = item;
    return data ? { ...data, isNew } : item;
  };

  const filteredWaterData = useMemo(
    () =>
      waterData
        .map(normalizeItem)
        .filter(
          item => item && item._id && item.usedWater && item.drinkingTime
        ),
    [waterData]
  );

  return (
    <div>
      <ScrollMenu
        scrollContainerClassName={css.horizontal_scroll_container}
        LeftArrow={null}
        RightArrow={null}
        wheel={true}
      >
        <div className={css.water_list}>
          {filteredWaterData.length === 0 ? (
            <p className={css.no_water_text}>
              {t('chooseDate.noWaterConsumed')}
            </p>
          ) : (
            filteredWaterData.map(item => (
              <WaterItem
                key={item._id}
                item={item}
                onEdit={onEdit}
                onDelete={onDelete}
                dateForCalendar={dateForCalendar}
              />
            ))
          )}
        </div>
      </ScrollMenu>
    </div>
  );
};

export default WaterList;
