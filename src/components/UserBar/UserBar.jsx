import { useState } from 'react';
import css from '../UserBar/UserBar.module.css';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/auth/selectors.js';
import UserBarPopover from '../UserBarPopover/UserBarPopover';
import sprite from '../../assets/icons/sprite.svg';
import { AiTwotoneSmile } from 'react-icons/ai';

const getFirstName = fullName => (fullName ? fullName.split(' ')[0] : 'User');

const Userbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const userInfo = useSelector(selectUser);

  const toggleMenu = () => {
    setMenuOpen(prevMenuOpen => !prevMenuOpen);
  };

  return (
    <div className={css.userBarMenu}>
      <button className={css.userBarBtn} onClick={toggleMenu}>
        {getFirstName(userInfo?.name)}
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
      {menuOpen && <UserBarPopover />}
    </div>
  );
};

export default Userbar;
