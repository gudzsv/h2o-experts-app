// import { useState } from 'react';
import css from './WaterList.module.css';
import WaterItem from 'components/WaterItem/WaterItem';

const WaterList = ({ waterData, onEdit, onDelete }) => {
  // console.log('Water Data:', waterData); // Лог данных для отладки
  // // Начальные данные
  // const [waterData, setWaterData] = useState([
  //   { id: 1, amount: 250, time: '7:00 AM' },
  //   { id: 2, amount: 250, time: '1:00 AM' },
  //   { id: 3, amount: 250, time: '14:00 PM' },
  //   { id: 4, amount: 250, time: '16:00 PM' },
  //   { id: 5, amount: 250, time: '16:00 PM' },
  //   { id: 6, amount: 250, time: '16:00 PM' },
  // ]);

  // const onDelete = id => {
  //   setWaterData(waterData.filter(item => item.id !== id));
  // };

  return (
    <div className={css.water_list_container}>
      <div className={css.water_list}>
        {waterData.length === 0 ? (
          <p>No water consumed on this day.</p>
        ) : (
          waterData.map(item => (
            <WaterItem
              key={item.id}
              item={item}
              onEdit={() => onEdit(item)}
              onDelete={() => onDelete(item.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default WaterList;
