import { useState, useEffect } from 'react';
import ChooseDate from './ChooseDate/ChooseDate';
import WaterList from 'components/WaterList/WaterList';
import WaterModal from 'components/WaterModal/WaterModal';
// import AddWaterBtnDailyInfo from './AddWaterBtnDailyInfo/AddWaterBtnDailyInfo';
import styles from './DailyInfo.module.css';
import { ModalTemplate } from 'components/Modal/Modal.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { selectDayWater, selectIsLoading } from '../../redux/water/selectors';
import { getDayWater, deleteWater } from '../../redux/water/operations';
import AddWaterBtn from 'components/AddWaterBtn/AddWaterBtn.jsx';
import { useModal } from 'components/Modal/UseModal.jsx';

const DailyInfo = ({ dateForCalendar }) => {
  const dispatch = useDispatch();
  const dayWater = useSelector(selectDayWater);
  const isLoading = useSelector(selectIsLoading);

  const { modalIsOpen, closeModal, openModal } = useModal();

  // const [editItem, setEditItem] = useState(null);
  const [editItem, setEditItem] = useState({});
  const [isActionType, setIsActionType] = useState('');
  const [isCurrentDay, setIsCurrentDay] = useState('');
  // const [modalIsOpen, setModalIsOpen] = useState(false);

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
    // setEditItem(null);
    setIsActionType('add');
    openModal();
    // setModalIsOpen(true);
  };

  const handleIsEditWater = item => {
    // setEditItem(item);

    setEditItem(item);
    setIsActionType('edit');
    openModal();
    // setModalIsOpen(true);
  };

  // const handleAddWater = newWaterData => {
  //   const formattedDate = getFormattedDate(dateForCalendar);
  //   const waterDataWithDate = {
  //     ...newWaterData,
  //     drinkingTime: `${formattedDate}T${newWaterData.drinkingTime}`,
  //   };
  //   dispatch(addWater(waterDataWithDate));
  //   setModalIsOpen(false);
  // };

  // const handleEditWater = updatedWaterData => {
  //   console.log(updatedWaterData);

  //   dispatch(editWater({ waterId: editItem._id, ...updatedWaterData }));
  //   setModalIsOpen(false);
  // };

  const handleDeleteWater = id => {
    dispatch(deleteWater(id));
  };

  return (
    <div className={styles.dailyInfo}>
      <div className={styles.wrapper}>
        <div className={styles.today_and_addBtn_container}>
          <ChooseDate selectedDate={dateForCalendar || new Date()} />
          {/* <AddWaterBtnDailyInfo onIsAdd={handleIsAddWater} /> */}
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
            <p>Loading...</p>
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
