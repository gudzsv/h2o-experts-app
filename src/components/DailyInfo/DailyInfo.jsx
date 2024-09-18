import { useState, useEffect } from 'react';
import ChooseDate from './ChooseDate/ChooseDate';
import WaterList from 'components/WaterList/WaterList';
import WaterModal from 'components/WaterModal/WaterModal';
import AddWaterBtnDayliInfo from './AddWaterBtnDayliInfo/AddWaterBtnDayliInfo';
import styles from './DailyInfo.module.css';
import { ModalTemplate } from 'components/Modal/Modal';
import { useDispatch, useSelector } from 'react-redux';

import { selectDayWater, selectIsLoading } from '../../redux/water/selectors';
import { addWater, getDayWater } from '../../redux/water/operations';
import BallTriangleLoader from './Loader/LoaderForDailyInfo';

const DailyInfo = ({ dateForCalendar }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const dispatch = useDispatch();
  const dayWater = useSelector(selectDayWater);
  const isLoading = useSelector(selectIsLoading);

  const getFormattedDate = () => {
    const year = dateForCalendar.getFullYear();
    const month = String(dateForCalendar.getMonth() + 1).padStart(2, '0');
    const day = String(dateForCalendar.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const formattedDate = getFormattedDate(dateForCalendar);
    dispatch(getDayWater(formattedDate));
  }, [dispatch, dateForCalendar]);

  const handleEdit = item => {
    setEditItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = () => {};

  const openAddWaterModal = () => {
    setEditItem(null);
    setIsModalOpen(true);
  };

  const handleAddWater = newWaterData => {
    dispatch(addWater(newWaterData));
  };

  return (
    <div className={styles.dailyInfo}>
      <div className={styles.wrapper}>
        <div className={styles.today_and_addBtn_container}>
          <ChooseDate
            selectedDate={dateForCalendar}
            setSelectedDate={() => {}}
          />
          <AddWaterBtnDayliInfo openModal={openAddWaterModal} />
        </div>

        {isModalOpen && (
          <ModalTemplate
            modalIsOpen={isModalOpen}
            closeModal={() => setIsModalOpen(false)}
          >
            <WaterModal
              closeModal={() => setIsModalOpen(false)}
              onAddWater={handleAddWater}
              editItem={editItem}
              edit={editItem ? true : false}
              waterId={editItem?.id || null}
            />
          </ModalTemplate>
        )}

        <div className={styles.water_list_wrapper}>
          {isLoading ? (
            <BallTriangleLoader />
          ) : (
            <WaterList
              waterData={dayWater}
              onEdit={handleEdit}
              onDelete={handleDelete}
              className={styles.water_list}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyInfo;
