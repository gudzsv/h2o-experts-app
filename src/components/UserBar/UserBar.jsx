import { useState, useEffect, useRef } from 'react';
import css from '../UserBar/UserBar.module.css';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/auth/selectors.js';
import UserBarPopover from '../UserBarPopover/UserBarPopover';
import sprite from '../../assets/icons/sprite.svg';
import { AiTwotoneSmile } from 'react-icons/ai';

const UserBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const userInfo = useSelector(selectUser);
  const userBarRef = useRef(null);
  const popoverRef = useRef(null);

  const userName =
    userInfo?.name === 'User'
      ? userInfo?.email.split('@')[0]
      : userInfo?.name || 'unknown user';

  const toggleMenu = e => {
    e.stopPropagation();
    setMenuOpen(prevMenuOpen => !prevMenuOpen);
  };

  const handleClickOutside = e => {
    if (
      userBarRef.current &&
      !userBarRef.current.contains(e.target) &&
      popoverRef.current &&
      !popoverRef.current.contains(e.target) &&
      !e.target.closest('.ReactModal__Content')
    ) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className={css.userBarMenu} ref={userBarRef}>
      <button
        className={css.userBarBtn}
        onClick={toggleMenu}
        aria-haspopup="true"
        aria-expanded={menuOpen}
      >
        {userName}
        {userInfo?.photo ? (
          <img src={userInfo.photo} alt="User Avatar" className={css.avatar} />
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
        <UserBarPopover ref={popoverRef} onClose={() => setMenuOpen(false)} />
      )}
    </div>
  );
};

export default UserBar;
