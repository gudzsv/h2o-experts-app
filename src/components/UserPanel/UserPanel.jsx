import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next'; // Додаємо хук для перекладу
import UserBar from '../UserBar/UserBar.jsx';
import {
  selectIsLoggedIn,
  selectIsLoading,
  selectUser,
} from '../../redux/auth/selectors.js';
import { currentUser } from '../../redux/auth/operations.js';
import css from './UserPanel.module.css';

export default function UserPanel() {
  const dispatch = useDispatch();
  const { t } = useTranslation(); // Ініціалізуємо переклад

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isLoading = useSelector(selectIsLoading);
  const userInfo = useSelector(selectUser);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(currentUser());
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
            {t('userPanel.greeting')},{' '}
            <span className={css.userName}>{userName}</span>!
          </h2>
          <UserBar userInfo={userInfo} />
        </>
      )}
    </div>
  );
}
