import { useTranslation } from 'react-i18next';
import css from './ChooseDate.module.css';

const ChooseDate = ({ selectedDate, onToday }) => {
  const { t, i18n } = useTranslation();
  const isToday = selectedDate.toDateString() === new Date().toDateString();

  return (
    <div className={css.wrapper}>
      <h3 className={css.daily_info}>
        {isToday
          ? t('chooseDate.today')
          : selectedDate.toLocaleDateString(i18n.language, {
              day: 'numeric',
              month: 'long',
            })}
      </h3>
      {!isToday && onToday && (
        <button
          type="button"
          className={css.todayButton}
          onClick={onToday}
          aria-label={t('chooseDate.backToToday')}
        >
          {t('chooseDate.toToday')}
        </button>
      )}
    </div>
  );
};

export default ChooseDate;
