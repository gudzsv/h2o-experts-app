import { useSelector } from 'react-redux';
import UserBar from '../UserBar/UserBar.jsx';
import { selectUser } from '../../redux/auth/selectors.js';
import css from './UserPanel.module.css';

export default function UserPanel() {
  // Очікує інформацію про користувача з src/redux/auth/selectors.js через селектор selectUser - об'єкт користувача: "name" і "email"
  const userInfo = useSelector(selectUser);

  const userName = userInfo?.name;

  const getFirstName = (name, email) => {
    if (name) {
      return name;
    }
    const emailLocalPart = email?.split('@')[0];
    return emailLocalPart;
  };

  return (
    <div className={css.container}>
      <h2 className={css.salutation}>
        Hello,{' '}
        <span className={css.userName}>
          {getFirstName(userName, userInfo?.email)}
        </span>
        !
      </h2>
      <UserBar />{' '}
    </div>
  );
}
