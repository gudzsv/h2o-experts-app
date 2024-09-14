const Calendar = ({ selectedDate, onDateChange }) => {
  // Массив дней для простоты
  const daysInMonth = Array.from({ length: 30 }, (_, index) => index + 1);

  const handleClick = day => {
    const newDate = new Date(selectedDate);
    newDate.setDate(day);
    onDateChange(newDate); // Передаем новую дату родителю
  };

  return (
    <div className="calendar">
      {daysInMonth.map(day => (
        <button
          key={day}
          className={`calendar-day ${
            selectedDate.getDate() === day ? 'selected' : ''
          }`}
          onClick={() => handleClick(day)}
        >
          {day}
        </button>
      ))}
    </div>
  );
};

export default Calendar;
