import { useCallback, useMemo, useState } from 'react';
import { ModalTemplate } from 'components/Modal/Modal.jsx';
import { useModal } from 'components/Modal/UseModal.jsx';
import { getEntryDateKey, toDateKey } from '../../helpers/date.js';
import WaterModal from './WaterModal.jsx';
import { WaterModalContext } from './waterModalContext.js';

const WaterModalProvider = ({ children }) => {
  const { modalIsOpen, openModal, closeModal } = useModal();
  const [request, setRequest] = useState({
    actionType: 'add',
    waterItem: null,
    dateKey: '',
  });

  const openAdd = useCallback(
    (dateKey = toDateKey(new Date())) => {
      setRequest({ actionType: 'add', waterItem: null, dateKey });
      openModal();
    },
    [openModal]
  );

  const openEdit = useCallback(
    waterItem => {
      setRequest({
        actionType: 'edit',
        waterItem,
        dateKey: getEntryDateKey(waterItem),
      });
      openModal();
    },
    [openModal]
  );

  const value = useMemo(() => ({ openAdd, openEdit }), [openAdd, openEdit]);

  return (
    <WaterModalContext.Provider value={value}>
      {children}
      <ModalTemplate modalIsOpen={modalIsOpen} closeModal={closeModal} tall>
        <WaterModal
          actionType={request.actionType}
          waterItem={request.waterItem}
          currentDay={request.dateKey}
          closeModal={closeModal}
        />
      </ModalTemplate>
    </WaterModalContext.Provider>
  );
};

export default WaterModalProvider;
