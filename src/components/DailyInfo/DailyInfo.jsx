import { useState, useEffect, useCallback, useMemo } from 'react';
import ChooseDate from './ChooseDate/ChooseDate';
import WaterList from 'components/WaterList/WaterList';
import WaterModal from 'components/WaterModal/WaterModal';
import styles from './DailyInfo.module.css';
import { ModalTemplate } from 'components/Modal/Modal.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { selectDayWater, selectIsLoading } from '../../redux/water/selectors';
import { getDayWater, deleteWater } from '../../redux/water/operations';
import AddWaterBtn from 'components/AddWaterBtn/AddWaterBtn.jsx';
import BallTriangleLoader from './Loader/LoaderForDailyInfo';
import { useModal } from 'components/Modal/UseModal.jsx';
import { toDateKey } from '../../helpers/date.js';

const DailyInfo = ({ dateForCalendar }) => {
  const dispatch = useDispatch();
  const dayWater = useSelector(selectDayWater);
  const isLoading = useSelector(selectIsLoading);

  const { modalIsOpen, closeModal, openModal } = useModal();
  const [editItem, setEditItem] = useState({});
  const [isActionType, setIsActionType] = useState('');
  const [isCurrentDay, setIsCurrentDay] = useState('');

  const formattedDate = useMemo(
    () => toDateKey(dateForCalendar || new Date()),
    [dateForCalendar]
  );

  useEffect(() => {
    if (formattedDate !== isCurrentDay) {
      setIsCurrentDay(formattedDate);
      dispatch(getDayWater(formattedDate));
    }
  }, [dispatch, formattedDate, isCurrentDay]);

  const handleIsAddWater = useCallback(() => {
    setIsActionType('add');
    openModal();
  }, [openModal]);

  const handleIsEditWater = useCallback(
    item => {
      setEditItem(item);
      setIsActionType('edit');
      openModal();
    },
    [openModal]
  );

  const handleDeleteWater = useCallback(
    id => {
      dispatch(deleteWater(id));
    },
    [dispatch]
  );

  return (
    <div className={styles.dailyInfo}>
      <div className={styles.wrapper}>
        <div className={styles.today_and_addBtn_container}>
          <ChooseDate selectedDate={dateForCalendar || new Date()} />
          <AddWaterBtn btnType="secondary" onClick={handleIsAddWater} />
        </div>

        <ModalTemplate
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
          aria-modal="true"
          role="dialog"
        >
          <WaterModal
            actionType={isActionType}
            waterItem={editItem}
            currentDay={isCurrentDay}
            closeModal={closeModal}
          />
        </ModalTemplate>

        <div className={styles.water_list_wrapper}>
          {isLoading ? (
            <BallTriangleLoader />
          ) : (
            <WaterList
              waterData={dayWater}
              onEdit={handleIsEditWater}
              onDelete={handleDeleteWater}
              dateForCalendar={dateForCalendar}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyInfo;
