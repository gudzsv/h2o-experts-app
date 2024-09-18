import WaterForm from './WaterForm/WaterForm.jsx';
import styles from './WaterModal.module.css';

const WaterModal = ({ add, edit }) => {
  return (
    <div className={styles.wrapper}>
      {edit ? (
        <h1 className={styles.title}> Edit the entered amount of water</h1>
      ) : add ? (
        <h1 className={styles.title}> Add water</h1>
      ) : (
        <h1 className={styles.title}>...</h1>
      )}
      <WaterForm add={add} edit={edit}></WaterForm>
    </div>
  );
};

export default WaterModal;
