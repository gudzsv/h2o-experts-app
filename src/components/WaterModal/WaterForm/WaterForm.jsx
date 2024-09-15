import styles from './WaterForm.module.css';
const WaterForm = ({ edit, add }) => {
  return (
    <>
      {edit ? (
        <h1 className={styles.title}> Edit the entered amount of water</h1>
      ) : add ? (
        <h1 className={styles.title}> Add water</h1>
      ) : (
        <h1 className={styles.title}>
          {' '}
          Default text if neither add nor edit is true
        </h1>
      )}
    </>
  );
};

export default WaterForm;
