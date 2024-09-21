import { useDispatch } from 'react-redux';
import { logOut } from '../../redux/auth/operations';
import { useNavigate } from 'react-router-dom';
import { ModalTemplate } from '../Modal/Modal';
import css from './LogOutModal.module.css';

export const LogOutModal = ({ modalIsOpen, closeModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    const response = await dispatch(logOut());
    if (response.meta.requestStatus === 'fulfilled') {
      localStorage.clear();
      dispatch({ type: 'auth/clearStore' });
      navigate('/');
      closeModal();
    }
  };

  return (
    <ModalTemplate modalIsOpen={modalIsOpen} closeModal={closeModal}>
      <div className={css.modalLogoutContent}>
        <div>
          <h2 className={css.modLogout}>Log out</h2>
          <p className={css.qModLogout}>Do you really want to leave?</p>
        </div>
        <div className={css.modalLogoutBtn}>
          <button className={css.modalLogoutBtnOut} onClick={handleLogOut}>
            Log out
          </button>
          <button className={css.modalLogoutBtnCancel} onClick={closeModal}>
            Cancel
          </button>
        </div>
      </div>
    </ModalTemplate>
  );
};

export default LogOutModal;
