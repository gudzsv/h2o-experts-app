import { useState, useEffect } from 'react';
import ChooseDate from './ChooseDate/ChooseDate';
import WaterList from 'components/WaterList/WaterList';
import WaterModal from 'components/WaterModal/WaterModal';
import AddWaterBtnDayliInfo from './AddWaterBtnDayliInfo/AddWaterBtnDayliInfo';
import styles from './DailyInfo.module.css';

const DailyInfo = ({ dateForCalendar }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [waterData, setWaterData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editItem, setEditItem] = useState(null);

  // Для функції з базою данних
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);

  // Тестові данні, формат ключів "YYYY-MM-DD"
  const waterHistory = {
    '2024-09-01': [
      { id: 1, amount: 250, time: '07:00 AM' },
      { id: 2, amount: 250, time: '11:00 AM' },
    ],
    '2024-09-02': [{ id: 3, amount: 250, time: '09:00 AM' }],
    '2024-09-03': [
      { id: 4, amount: 250, time: '09:00 AM' },
      { id: 5, amount: 250, time: '07:00 AM' },
    ],
    '2024-09-04': [
      { id: 6, amount: 250, time: '11:00 AM' },
      { id: 7, amount: 250, time: '11:00 AM' },
      { id: 8, amount: 250, time: '11:00 AM' },
      { id: 9, amount: 250, time: '07:00 AM' },
    ],
    '2024-09-15': [
      { id: 10, amount: 250, time: '11:00 AM' },
      { id: 11, amount: 250, time: '11:00 AM' },
      { id: 12, amount: 250, time: '11:00 AM' },
      { id: 13, amount: 250, time: '07:00 AM' },
      { id: 14, amount: 250, time: '11:00 AM' },
      { id: 15, amount: 250, time: '11:00 AM' },
      { id: 16, amount: 250, time: '11:00 AM' },
      { id: 17, amount: 250, time: '07:00 AM' },
    ],
  };

  const getFormattedDate = () => {
    const year = dateForCalendar.getFullYear();
    const month = String(dateForCalendar.getMonth() + 1).padStart(2, '0');
    const day = String(dateForCalendar.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  // Функція для отримання данних з бази данних / поки працюємо з тестовими данними
  // const fetchWaterDataForDate = async formattedDate => {
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const response = await fetch(`/api/water-data?date=${formattedDate}`);
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch water data');
  //     }
  //     const data = await response.json();
  //     setWaterData(data);
  //   } catch (error) {
  //     setError(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchWaterDataForDate = formattedDate => {
    setWaterData(waterHistory[formattedDate] || []);
  };

  useEffect(() => {
    const formattedDate = getFormattedDate();
    fetchWaterDataForDate(formattedDate);
  }, [dateForCalendar]);

  const handleEdit = item => {
    setEditItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = id => {
    const updatedData = waterData.filter(item => item.id !== id);
    setWaterData(updatedData);
  };

  const openAddWaterModal = () => {
    setIsModalOpen(true);
  };

  const handleAddWater = newWaterData => {
    setWaterData([...waterData, newWaterData]);
    setIsModalOpen(false);
  };

  return (
    <div className={styles.dailyInfo}>
      <div className={styles.wrapper}>
        <div className={styles.today_and_addBtn_container}>
          <ChooseDate
            selectedDate={dateForCalendar}
            setSelectedDate={setSelectedDate}
          />
          <AddWaterBtnDayliInfo openModal={openAddWaterModal} />
        </div>

        {isModalOpen && (
          <WaterModal
            closeModal={() => setIsModalOpen(false)}
            onAddWater={handleAddWater}
            editItem={editItem}
          />
        )}

        <div className={styles.water_list_wrapper}>
          <WaterList
            className={styles.water_list}
            waterData={waterData}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default DailyInfo;
