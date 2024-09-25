import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { logOut } from '../../redux/auth/operations';
import { useNavigate } from 'react-router-dom';
import { ModalTemplate } from '../Modal/Modal';
import css from './LogOutModal.module.css';

export const LogOutModal = React.memo(({ modalIsOpen, closeModal }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = () => {
    dispatch(logOut()).then(response => {
      if (response.meta.requestStatus === 'fulfilled') {
        closeModal();
        navigate('/');
      }
    });
  };

  return (
    <ModalTemplate modalIsOpen={modalIsOpen} closeModal={closeModal}>
      <div
        className={css.modalLogoutContent}
        role="dialog"
        aria-labelledby="logoutModalTitle"
        aria-describedby="logoutModalDescription"
      >
        <div className={css.titleOut}>
          <h2 id="logoutModalTitle" className={css.modLogout}>
            {t('logOutModal.title')}
          </h2>
          <p id="logoutModalDescription" className={css.qModLogout}>
            {t('logOutModal.confirm')}
          </p>
        </div>
        <div className={css.modalLogoutBtn}>
          <button
            className={css.modalLogoutBtnOut}
            onClick={handleLogOut}
            aria-label={t('logOutModal.ariaLogOut')}
          >
            {t('logOutModal.logOut')}
          </button>
          <button
            className={css.modalLogoutBtnCancel}
            onClick={closeModal}
            aria-label={t('logOutModal.ariaClose')}
          >
            {t('logOutModal.close')}
          </button>
        </div>
      </div>
    </ModalTemplate>
  );
});

LogOutModal.displayName = 'LogOutModal';

export default LogOutModal;
