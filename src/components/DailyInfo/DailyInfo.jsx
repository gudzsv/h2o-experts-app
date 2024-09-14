import { useState, useEffect } from 'react';
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ChooseDate from 'components/ChooseDate/ChooseDate';
import WaterList from 'components/WaterList/WaterList';
import WaterModal from 'components/WaterModal/WaterModal';
import Calendar from 'components/Calendar/Calendar';
import css from './AddWaterBtnDetailedInfo.module.css';

const DailyInfo = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Текущая дата по умолчанию
  const [waterData, setWaterData] = useState([]); // Данные по воде

  // // Асинхронный thunk для получения данных с бэкенда
  //   export const fetchWaterData = createAsyncThunk('water/fetchWaterData', async (date) => {
  //   const response = await fetch(`/api/water-data?date=${date}`);
  //   const data = await response.json();
  //   return data; // Возвращаем полученные данные
  // });

  // Мок данных по дням, формат ключей "YYYY-MM-DD"
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
    '2024-09-14': [
      { id: 10, amount: 250, time: '11:00 AM' },
      { id: 11, amount: 250, time: '11:00 AM' },
      { id: 12, amount: 250, time: '11:00 AM' },
      { id: 13, amount: 250, time: '07:00 AM' },
    ],
  };

  // Форматируем дату в строку "YYYY-MM-DD"  +
  const formatDateKey = date => {
    return date.toISOString().split('T')[0];
  };

  // Загружаем данные за текущий день при первой загрузке страницы +
  useEffect(() => {
    fetchWaterDataForDate(new Date());
  }, []); // Этот эффект выполнится только один раз при загрузке компонента

  // Функция для получения данных по выбранной дате +
  const fetchWaterDataForDate = date => {
    const formattedDate = formatDateKey(date); // Форматируем дату
    setWaterData(waterHistory[formattedDate] || []); // Устанавливаем данные за выбранный день
  };

  // Функция для обновления выбранной даты +
  const handleDateChange = date => {
    setSelectedDate(date); // Обновляем выбранную дату
    fetchWaterDataForDate(date); // Получаем данные за выбранную дату
  };

  // Функция для сброса на текущую дату после перезагрузки
  const resetToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    const storedHistory =
      JSON.parse(localStorage.getItem('waterHistory')) || {};
    setWaterData(storedHistory[formatDateKey(today)] || []);
  };

  // Сбрасываем выбранную дату на сегодняшнюю при перезагрузке страницы
  useEffect(() => {
    resetToToday();
  }, []);

  // Функция для форматирования заголовка
  const formatDate = date => {
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // // Обновление данных при изменении выбранной даты --------------- закоментил
  // useEffect(() => {
  //   const dateKey = formatDateKey(selectedDate);
  //   console.log('Selected Date Key:', dateKey);
  //   console.log('Water History Data:', waterHistory[dateKey]);
  //   setWaterData(waterHistory[dateKey] || []); // Получаем данные за выбранный день
  // }, [selectedDate]);

  // Удаление элемента
  const handleDelete = id => {
    setWaterData(prevData => prevData.filter(item => item.id !== id));
  };

  // Редактирование элемента
  const openEditModal = item => {
    // Открытие модального окна для редактирования (добавьте логику)
    console.log('Edit item', item);
  };

  return (
    <div className="daily-info">
      {/* Динамический заголовок, меняется в зависимости от выбранной даты */}
      <h3>{formatDate(selectedDate)}</h3>

      {/* Кнопка Add Water */}
      <button onClick={() => setModalOpen(true)} className={css.button}>
        <div className={css.wrapper}>
          <svg width="30" height="30" className={css.icon}>
            <use href="/src/assets/icons/sprite.svg#icon-plus-btn"></use>
          </svg>
          {'Add Water'}
        </div>
      </button>

      {/* Список воды за выбранную дату */}
      <WaterList
        waterData={waterData}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      {/* Модальное окно для добавления воды */}
      {modalOpen && <WaterModal closeModal={() => setModalOpen(false)} />}

      {/* Календарь для выбора даты */}
      <Calendar selectedDate={selectedDate} onDateChange={handleDateChange} />
    </div>
  );
};
export default DailyInfo;

// return (
//   <div>
//     <ChooseDate />
//     <AddWaterBtnDetailedInfo />
//     <WaterList />
//     <Calendar selectedDate={selectedDate} onDateChange={handleDateChange} />
//   </div>
// );
// };
// export default DailyInfo;
