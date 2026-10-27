import { useTranslation } from 'react-i18next';

import WaterForm from './WaterForm/WaterForm.jsx';
import styles from './WaterModal.module.css';

const WaterModal = ({ actionType, closeModal, waterItem, currentDay }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>{t(`waterModal.${actionType}`)}</h1>

      <WaterForm
        actionType={actionType}
        waterItem={waterItem}
        currentDay={currentDay}
        closeModal={closeModal}
      ></WaterForm>
    </div>
  );
};

export default WaterModal;
