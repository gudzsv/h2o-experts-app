import LogOutModal from 'components/LogOutModal/LogOutModal.jsx';
import UserSettingsModal from 'components/UserSettingsModal/UserSettingsModal.jsx';
import { useState } from 'react';

const UserBarPopover = () => {
  const [isOpenLogOut, setIsOpenLogOut] = useState(false);
  const [isOpenSettings, setIsOpenSettings] = useState(false);

  return (
    <div>
      UserBarPopover
      {isOpenSettings && (
        <UserSettingsModal onClose={() => setIsOpenSettings(false)} />
      )}
      {isOpenLogOut && <LogOutModal onClose={() => setIsOpenLogOut(false)} />}
    </div>
  );
};

export default UserBarPopover;
