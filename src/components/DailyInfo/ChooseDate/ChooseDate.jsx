import { useTranslation } from 'react-i18next';
import css from './ChooseDate.module.css';

const ChooseDate = ({ selectedDate }) => {
  const { t, i18n } = useTranslation();

  const formatDate = date => {
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return t('chooseDate.today');
    }
    return date.toLocaleDateString(i18n.language, {
      day: 'numeric',
      month: 'long',
    });
  };

  return (
    <div>
      <h3 className={css.daily_info}>{formatDate(selectedDate)}</h3>
    </div>
  );
};

export default ChooseDate;
