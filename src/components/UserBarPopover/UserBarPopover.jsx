import { useEffect, useRef, useState, useCallback } from 'react';
import css from './UserBarPopover.module.css';
import LogOutModal from '../../components/LogOutModal/LogOutModal.jsx';
import UserSettingsModal from '../../components/UserSettingsModal/UserSettingsModal.jsx';
import { CiSettings } from 'react-icons/ci';
import { IoIosLogOut } from 'react-icons/io';

export default function UserBarPopover({ onClose }) {
  const popoverRef = useRef(null);
  const [isOpenLogOut, setIsOpenLogOut] = useState(false);
  const [isOpenSettings, setIsOpenSettings] = useState(false);

  const handleClickOutside = useCallback(
    event => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const handleLogoutClick = () => {
    setIsOpenLogOut(true);
    onClose();
  };

  const handleSettingsClick = () => {
    setIsOpenSettings(true);
    onClose();
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
        <UserSettingsModal onClose={() => setIsOpenSettings(false)} />
      )}
      {isOpenLogOut && <LogOutModal onClose={() => setIsOpenLogOut(false)} />}
    </div>
  );
}
