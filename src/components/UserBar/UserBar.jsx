import { useState, useRef, useCallback, useMemo } from 'react';
import css from '../UserBar/UserBar.module.css';
import UserBarPopover from '../UserBarPopover/UserBarPopover';
import sprite from '../../assets/icons/sprite.svg';
import { AiTwotoneSmile } from 'react-icons/ai';

const UserBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef(null);
  const popoverRef = useRef(null);

  const userName = useMemo(() => {
    if (userInfo?.name === 'User') {
      return userInfo?.email.split('@')[0];
    }
    return userInfo?.name || 'unknown user';
  }, [userInfo?.name, userInfo?.email]);

  const toggleMenu = useCallback(
    e => {
      e.stopPropagation();
      setMenuOpen(prevMenuOpen => !prevMenuOpen);
    },
    [setMenuOpen]
  );

  return (
    <div className={css.userBarMenu}>
      <button ref={buttonRef} className={css.userBarBtn} onClick={toggleMenu}>
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
        <UserBarPopover ref={popoverRef} onClose={() => setMenuOpen(false)} />
      )}
    </div>
  );
};

export default UserBar;
