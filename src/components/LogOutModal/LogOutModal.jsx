import React from 'react';
import { useDispatch } from 'react-redux';
import { logOut } from '../../redux/auth/operations';
import { useNavigate } from 'react-router-dom';
import { ModalTemplate } from '../Modal/Modal';
import css from './LogOutModal.module.css';

export const LogOutModal = React.memo(({ modalIsOpen, closeModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    const response = await dispatch(logOut());
    if (response.meta.requestStatus === 'fulfilled') {
      closeModal();
      navigate('/');
    }
  };

  return (
    <ModalTemplate modalIsOpen={modalIsOpen} closeModal={closeModal}>
      <div
        className={css.modalLogoutContent}
        role="dialog"
        aria-labelledby="logoutModalTitle"
        aria-describedby="logoutModalDescription"
      >
        <div>
          <h2 id="logoutModalTitle" className={css.modLogout}>
            Log out
          </h2>
          <p id="logoutModalDescription" className={css.qModLogout}>
            Do you really want to leave?
          </p>
        </div>
        <div className={css.modalLogoutBtn}>
          <button
            className={css.modalLogoutBtnOut}
            onClick={handleLogOut}
            aria-label="Confirm log out"
          >
            Log out
          </button>
          <button
            className={css.modalLogoutBtnCancel}
            onClick={closeModal}
            aria-label="Cancel log out"
          >
            Cancel
          </button>
        </div>
      </div>
    </ModalTemplate>
  );
});

LogOutModal.displayName = 'LogOutModal';

export default LogOutModal;
