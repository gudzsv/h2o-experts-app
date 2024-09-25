import React from 'react';
import { useDispatch } from 'react-redux';
import { logOut } from '../../redux/auth/operations';
import { useNavigate } from 'react-router-dom';
import { ModalTemplate } from '../Modal/Modal';
import { useTranslation } from 'react-i18next';
import css from './LogOutModal.module.css';

export const LogOutModal = React.memo(({ modalIsOpen, closeModal }) => {
  const { t } = useTranslation();
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
        <div className={css.titleOut}>
          <h2 id="logoutModalTitle" className={css.modLogout}>
            {t('logoutModal.outtitle')}
          </h2>
          <p id="logoutModalDescription" className={css.qModLogout}>
            {t('logoutModal.questionout')}
          </p>
        </div>
        <div className={css.modalLogoutBtn}>
          <button
            className={css.modalLogoutBtnOut}
            onClick={handleLogOut}
            aria-label={t('logoutModal.ariaConfirm')}
          >
            {t('logoutModal.outbtn')}
          </button>
          <button
            className={css.modalLogoutBtnCancel}
            onClick={closeModal}
            aria-label={t('logoutModal.ariaClose')}
          >
            {t('logoutModal.cancelbtn')}
          </button>
        </div>
      </div>
    </ModalTemplate>
  );
});

LogOutModal.displayName = 'LogOutModal';

export default LogOutModal;
