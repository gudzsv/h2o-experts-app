import React, { useState } from 'react';
import css from './UserBarPopover.module.css';
import LogOutModal from '../../components/LogOutModal/LogOutModal.jsx';
import UserSettingsModal from '../../components/UserSettingsModal/UserSettingsModal.jsx';
import { CiSettings } from 'react-icons/ci';
import { IoIosLogOut } from 'react-icons/io';

const UserBarPopover = React.forwardRef(({ onClose }, popoverRef) => {
  const [isOpenLogOut, setIsOpenLogOut] = useState(false);
  const [isOpenSettings, setIsOpenSettings] = useState(false);

  const handleLogoutClick = e => {
    e.stopPropagation();
    console.log('Відкриття модального вікна LogOut');
    setIsOpenLogOut(true);
  };

  const handleSettingsClick = e => {
    e.stopPropagation();
    console.log('Відкриття модального вікна Settings');
    setIsOpenSettings(true);
  };

  return (
    <div className={css.userBarPopover} ref={popoverRef}>
      <button className={css.popoverButton} onClick={handleSettingsClick}>
        <CiSettings />
        <span>Settings</span>
      </button>
      <button className={css.popoverButton} onClick={handleLogoutClick}>
        <IoIosLogOut />
        <span>Log out</span>
      </button>

      {isOpenSettings && (
        <UserSettingsModal
          modalIsOpen={isOpenSettings}
          onClose={() => {
            setIsOpenSettings(false);
            onClose();
          }}
        />
      )}
      {isOpenLogOut && (
        <LogOutModal
          modalIsOpen={isOpenLogOut}
          closeModal={() => {
            setIsOpenLogOut(false);
            onClose();
          }}
        />
      )}
    </div>
  );
});

UserBarPopover.displayName = 'UserBarPopover';

export default UserBarPopover;
