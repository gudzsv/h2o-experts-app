import { useDispatch } from 'react-redux';
import { logOut } from '../../redux/auth/operations.js';
import { useNavigate } from 'react-router-dom';
import css from './LogOutModal.module.css';

export const LogOutModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    const response = await dispatch(logOut());
    if (response.meta.requestStatus === 'fulfilled') {
      localStorage.clear();
      navigate('/');
      onClose();
    }
  };

  return (
    <div
      className={css['overlay']}
      role="dialog"
      aria-label="logout-modal-title"
    >
      <div className={css['modal-logout']}>
        <button
          type="button"
          className={css['close-button-mod']}
          onClick={onClose}
          aria-label="Close"
        >
          <svg className={css['close-icon-mod']} width="24" height="24">
            <use href="../../assets/icons/sprite.svg#icon-x"></use>
          </svg>
        </button>
        <div className={css['modal-logout-content']}>
          <h2 id="logout-modal-title" className={css['mod-logout']}>
            Log out
          </h2>
          <p className={css['q-mod-logout']}>Do you really want to leave?</p>
        </div>
        <div className={css['modal-logout-btn']}>
          <button
            className={css['modal-logout-btn-out']}
            onClick={handleLogOut}
            aria-label="Log out"
          >
            Log out
          </button>
          <button
            className={css['modal-logout-btn-cancel']}
            onClick={onClose}
            aria-label="Cancel"
          >
            <span className={css['modal-cancel']}>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogOutModal;
