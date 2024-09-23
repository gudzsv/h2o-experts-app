import { useState, useEffect, useCallback, useMemo } from 'react';
import ChooseDate from './ChooseDate/ChooseDate';
import WaterList from 'components/WaterList/WaterList';
import WaterModal from 'components/WaterModal/WaterModal';
import styles from './DailyInfo.module.css';
import { ModalTemplate } from 'components/Modal/Modal.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { selectDayWater, selectIsLoading } from '../../redux/water/selectors';
import {
  getDayWater,
  deleteWater,
  getMonthWater,
} from '../../redux/water/operations';
import AddWaterBtn from 'components/AddWaterBtn/AddWaterBtn.jsx';
import BallTriangleLoader from './Loader/LoaderForDailyInfo';
import { useModal } from 'components/Modal/UseModal.jsx';

const getFormattedDate = date => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const DailyInfo = ({ dateForCalendar }) => {
  const dispatch = useDispatch();
  const dayWater = useSelector(selectDayWater);
  const isLoading = useSelector(selectIsLoading);

  const { modalIsOpen, closeModal, openModal } = useModal();
  const [editItem, setEditItem] = useState({});
  const [isActionType, setIsActionType] = useState('');
  const [isCurrentDay, setIsCurrentDay] = useState('');

  const formattedDate = useMemo(
    () => getFormattedDate(dateForCalendar || new Date()),
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
    async id => {
      await dispatch(deleteWater(id));
      dispatch(getDayWater(formattedDate));
      dispatch(getMonthWater(formattedDate.slice(0, -3)));
    },
    [dispatch, formattedDate]
  );

  return (
    <div className={styles.dailyInfo}>
      <div className={styles.wrapper}>
        <div className={styles.today_and_addBtn_container}>
          <ChooseDate selectedDate={dateForCalendar || new Date()} />
          <AddWaterBtn
            btnType="secondary"
            onClick={handleIsAddWater}
            aria-label="Add water record"
          />
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
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyInfo;
