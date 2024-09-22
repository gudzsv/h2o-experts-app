import { useState, useEffect } from 'react';
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

const DailyInfo = ({ dateForCalendar }) => {
  const dispatch = useDispatch();
  const dayWater = useSelector(selectDayWater);
  const isLoading = useSelector(selectIsLoading);

  const { modalIsOpen, closeModal, openModal } = useModal();
  const [editItem, setEditItem] = useState({});
  const [isActionType, setIsActionType] = useState('');
  const [isCurrentDay, setIsCurrentDay] = useState('');

  const getFormattedDate = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const formattedDate = getFormattedDate(dateForCalendar || new Date());
    setIsCurrentDay(formattedDate);
    dispatch(getDayWater(formattedDate));
  }, [dispatch, dateForCalendar]);

  const handleIsAddWater = () => {
    setIsActionType('add');
    openModal();
  };

  const handleIsEditWater = item => {
    setEditItem(item);
    setIsActionType('edit');
    openModal();
  };

  const handleDeleteWater = id => {
    dispatch(deleteWater(id)).then(() => {
      dispatch(getDayWater(getFormattedDate(dateForCalendar || new Date())));
    });
  };

  return (
    <div className={styles.dailyInfo}>
      <div className={styles.wrapper}>
        <div className={styles.today_and_addBtn_container}>
          <ChooseDate selectedDate={dateForCalendar || new Date()} />
          <AddWaterBtn btnType="secondary" onClick={handleIsAddWater} />
        </div>

        <ModalTemplate modalIsOpen={modalIsOpen} closeModal={closeModal}>
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
