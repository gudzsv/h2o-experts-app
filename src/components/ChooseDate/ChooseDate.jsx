import { useState } from 'react';

const ChooseDate = ({ selectedDate, onDateChange }) => {
  const [currentDate, setCurrentDate] = useState(selectedDate);

  // Обрабатываем выбор даты
  const handleDateChange = event => {
    const newDate = new Date(event.target.value); // Получаем новую дату
    setCurrentDate(newDate);
    onDateChange(newDate); // Передаем дату в родительский компонент
  };

  return (
    <div className="choose-date">
      <label htmlFor="date-picker">Choose a date:</label>
      <input
        id="date-picker"
        type="date"
        value={currentDate.toISOString().split('T')[0]} // Устанавливаем текущее значение
        onChange={handleDateChange} // Обрабатываем изменение
      />
    </div>
  );
};

export default ChooseDate;
