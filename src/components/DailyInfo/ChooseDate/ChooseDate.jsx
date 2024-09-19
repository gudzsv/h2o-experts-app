import css from './ChooseDate.module.css';

const ChooseDate = ({ selectedDate }) => {
  // Функція для форматування заголовка з дати у строку
  const formatDate = date => {
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    return date
      .toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
      })
      .replace(' ', ', ');
  };

  return (
    <div>
      <h3 className={css.daily_info}>{formatDate(selectedDate)}</h3>
    </div>
  );
};

export default ChooseDate;
