import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UserBar from '../UserBar/UserBar.jsx';
import {
  selectIsLoggedIn,
  selectIsLoading,
} from '../../redux/auth/selectors.js';
import { currentUser } from '../../redux/auth/operations.js';
import css from './UserPanel.module.css';

export default function UserPanel() {
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState(null);

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(currentUser())
        .unwrap()
        .then(response => {
          setUserInfo(response.data); // Отримуємо та зберігаємо дані про користувача
        })
        .catch(error => {
          console.error('Error loading user profile:', error);
        });
    }
  }, [dispatch, isLoggedIn]);

  const userName =
    userInfo?.name === 'User'
      ? userInfo?.email.split('@')[0]
      : userInfo?.name || 'unknown user';

  return (
    <div className={css.container}>
      {isLoggedIn && !isLoading && (
        <>
          <h2 className={css.salutation}>
            Hello, <span className={css.userName}>{userName}</span>!
          </h2>
          <UserBar userInfo={userInfo} /> {/* Передаємо дані в UserBar */}
        </>
      )}
    </div>
  );
}
