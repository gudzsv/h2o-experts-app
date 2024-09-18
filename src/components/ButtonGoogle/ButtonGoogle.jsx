import sprite from '../../assets/icons/sprite.svg';
import styles from './ButtonGoogle.module.css';

const ButtonGoogle = ({ label }) => {
  const handleClick = () => {
    console.log('Google');
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className={styles.btn}
      aria-label="Sign in button for an account with Google"
    >
      {label} with
      <svg className={styles.icon}>
        <use href={`${sprite}${'#google-logo'}`} width={65} height={20}></use>
      </svg>
    </button>
  );
};

export default ButtonGoogle;
