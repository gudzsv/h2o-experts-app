import WaterForm from './WaterForm/WaterForm.jsx';
import styles from './WaterModal.module.css';

const WaterModal = ({ actionType, closeModal, waterItem, currentDay }) => {
  return (
    <div className={styles.wrapper}>
      {actionType === 'edit' ? (
        <h1 className={styles.title}> Edit the entered amount of water</h1>
      ) : actionType === 'add' ? (
        <h1 className={styles.title}> Add water</h1>
      ) : (
        <h1 className={styles.title}>...</h1>
      )}

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
