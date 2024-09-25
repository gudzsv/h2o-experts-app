import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import UserBar from '../UserBar/UserBar.jsx';
import { selectUser } from '../../redux/auth/selectors.js';

import css from './UserPanel.module.css';

export default function UserPanel() {
  const { t } = useTranslation();

  const userInfo = useSelector(selectUser);

  const userName =
    userInfo?.name === 'User'
      ? userInfo?.email.split('@')[0]
      : userInfo?.name || 'unknown user';

  return (
    <div className={css.container}>
      <h2 className={css.salutation}>
        {t('userPanel.greeting')},&nbsp;
        <span className={css.userName}>{userName}!</span>
      </h2>
      <UserBar userInfo={userInfo} />
    </div>
  );
}
