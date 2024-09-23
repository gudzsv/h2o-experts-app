import { useState, useRef } from 'react';
import css from '../UserBar/UserBar.module.css';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/auth/selectors.js';
import UserBarPopover from '../UserBarPopover/UserBarPopover';
import sprite from '../../assets/icons/sprite.svg';
import { AiTwotoneSmile } from 'react-icons/ai';

const UserBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const userInfo = useSelector(selectUser);
  const buttonRef = useRef(null);
  const popoverRef = useRef(null);

  const userName =
    userInfo?.name === 'User'
      ? userInfo?.email.split('@')[0]
      : userInfo?.name || 'unknown user';

  const toggleMenu = e => {
    e.stopPropagation();
    setMenuOpen(prevMenuOpen => !prevMenuOpen);
  };

  const handleSettingsClick = () => {
    setMenuOpen(false);
  };

  const handleLogoutClick = () => {
    setMenuOpen(false);
  };

  return (
    <div className={css.userBarMenu}>
      <button
        ref={buttonRef}
        className={css.userBarBtn}
        onClick={toggleMenu}
        aria-haspopup="true"
        aria-expanded={menuOpen}
      >
        {userName}
        {userInfo?.avatar ? (
          <img src={userInfo.avatar} alt="User Avatar" className={css.avatar} />
        ) : (
          <span className={css.avatarPlaceholder}>
            <AiTwotoneSmile />
          </span>
        )}
        <svg className={`${css.chevron} ${menuOpen ? css.open : ''}`}>
          <use href={`${sprite}#icon-chevron-up`} />
        </svg>
      </button>
      {menuOpen && (
        <UserBarPopover ref={popoverRef} role="menu">
          <button
            onClick={handleSettingsClick}
            role="menuitem"
            aria-label="Open settings"
          >
            Settings
          </button>
          <button
            onClick={handleLogoutClick}
            role="menuitem"
            aria-label="Log out"
          >
            Logout
          </button>
        </UserBarPopover>
      )}
    </div>
  );
};

export default UserBar;
