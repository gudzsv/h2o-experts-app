// import { useState, useEffect } from 'react';
// import ChooseDate from './ChooseDate/ChooseDate';
// import WaterList from 'components/WaterList/WaterList';
// import WaterModal from 'components/WaterModal/WaterModal';
// import AddWaterBtnDayliInfo from './AddWaterBtnDayliInfo/AddWaterBtnDayliInfo';
// import styles from './DailyInfo.module.css';
// import { useModal } from 'components/Modal/UseModal.jsx';
// import { ModalTemplate } from 'components/Modal/Modal.jsx';

// const DailyInfo = ({ dateForCalendar }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [waterData, setWaterData] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [editItem, setEditItem] = useState(null);
//   const [isActionType, setIsActionType] = useState('');

//   const { modalIsOpen, closeModal, openModal } = useModal();

//   const getFormattedDate = () => {
//     const year = dateForCalendar.getFullYear();
//     const month = String(dateForCalendar.getMonth() + 1).padStart(2, '0');
//     const day = String(dateForCalendar.getDate()).padStart(2, '0');

//     return `${year}-${month}-${day}`;
//   };

//   const fetchWaterDataForDate = formattedDate => {
//     setWaterData(waterHistory[formattedDate] || []);
//   };

//   useEffect(() => {
//     const formattedDate = getFormattedDate();
//     fetchWaterDataForDate(formattedDate);
//   }, [dateForCalendar]);

//   const handleEdit = item => {
//     setEditItem(item);
//     setIsModalOpen(true);
//   };

//   const handleDelete = id => {
//     const updatedData = waterData.filter(item => item.id !== id);
//     setWaterData(updatedData);
//   };

//   const handleIsAddWater = () => {
//     openModal();
//     setIsActionType('add');
//   };
//   const handleIsEditWater = () => {
//     openModal();
//     setIsActionType('edit');
//   };

//   return (
//     <div className={styles.dailyInfo}>
//       <div className={styles.wrapper}>
//         <div className={styles.today_and_addBtn_container}>
//           <ChooseDate
//             selectedDate={dateForCalendar}
//             setSelectedDate={setSelectedDate}
//           />
//           <AddWaterBtnDayliInfo onIsAdd={handleIsAddWater} />
//         </div>

//         <ModalTemplate modalIsOpen={modalIsOpen} closeModal={closeModal}>
//           <WaterModal
//             actionType={isActionType}
//             // waterId={waterId} тут я очікую при кнопці edit id обєкта який редагується
//             // currentDay={currentDay} тут дату в форматі YYYY-MM-DD
//           />
//         </ModalTemplate>

//         <div className={styles.water_list_wrapper}>
//           <WaterList
//             className={styles.water_list}
//             waterData={waterData}
//             onEdit={handleIsEditWater}
//             onDelete={handleDelete}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

import { useState, useEffect } from 'react';
import ChooseDate from './ChooseDate/ChooseDate';
import WaterList from 'components/WaterList/WaterList';
import WaterModal from 'components/WaterModal/WaterModal';
import AddWaterBtnDayliInfo from './AddWaterBtnDayliInfo/AddWaterBtnDayliInfo';
import styles from './DailyInfo.module.css';
import { ModalTemplate } from 'components/Modal/Modal.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { selectDayWater, selectIsLoading } from '../../redux/water/selectors';
import {
  addWater,
  editWater,
  getDayWater,
  deleteWater,
} from '../../redux/water/operations';

const DailyInfo = ({ dateForCalendar }) => {
  const dispatch = useDispatch();
  const dayWater = useSelector(selectDayWater);
  const isLoading = useSelector(selectIsLoading);

  const [editItem, setEditItem] = useState(null);
  const [isActionType, setIsActionType] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const getFormattedDate = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const formattedDate = getFormattedDate(dateForCalendar || new Date());
    dispatch(getDayWater(formattedDate));
  }, [dispatch, dateForCalendar]);

  const handleIsAddWater = () => {
    setEditItem(null);
    setIsActionType('add');
    setModalIsOpen(true);
  };

  const handleIsEditWater = item => {
    setEditItem(item);
    setIsActionType('edit');
    setModalIsOpen(true);
  };

  const handleAddWater = newWaterData => {
    const formattedDate = getFormattedDate(dateForCalendar);
    const waterDataWithDate = {
      ...newWaterData,
      drinkingTime: `${formattedDate}T${newWaterData.drinkingTime}`,
    };
    dispatch(addWater(waterDataWithDate));
    setModalIsOpen(false);
  };

  const handleEditWater = updatedWaterData => {
    dispatch(editWater({ waterId: editItem._id, ...updatedWaterData }));
    setModalIsOpen(false);
  };

  const handleDeleteWater = id => {
    dispatch(deleteWater(id));
  };

  return (
    <div className={styles.dailyInfo}>
      <div className={styles.wrapper}>
        <div className={styles.today_and_addBtn_container}>
          <ChooseDate selectedDate={dateForCalendar || new Date()} />
          <AddWaterBtnDayliInfo onIsAdd={handleIsAddWater} />
        </div>

        {modalIsOpen && (
          <ModalTemplate
            modalIsOpen={modalIsOpen}
            closeModal={() => setModalIsOpen(false)}
          >
            <WaterModal
              actionType={isActionType}
              onAddWater={handleAddWater}
              onEditWater={handleEditWater}
              editItem={editItem}
              closeModal={() => setModalIsOpen(false)}
            />
          </ModalTemplate>
        )}

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
