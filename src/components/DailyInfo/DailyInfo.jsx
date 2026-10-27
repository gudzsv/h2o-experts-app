import { useEffect, useCallback, useMemo } from 'react';
import ChooseDate from './ChooseDate/ChooseDate';
import WaterList from 'components/WaterList/WaterList';
import styles from './DailyInfo.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectDayWater, selectIsLoading } from '../../redux/water/selectors';
import { getDayWater, deleteWater } from '../../redux/water/operations';
import AddWaterBtn from 'components/AddWaterBtn/AddWaterBtn.jsx';
import BallTriangleLoader from './Loader/LoaderForDailyInfo';
import { useWaterModal } from 'components/WaterModal/waterModalContext.js';
import { toDateKey } from '../../helpers/date.js';

const DailyInfo = ({ dateForCalendar }) => {
  const dispatch = useDispatch();
  const dayWater = useSelector(selectDayWater);
  const isLoading = useSelector(selectIsLoading);

  const { openAdd, openEdit } = useWaterModal();

  const formattedDate = useMemo(
    () => toDateKey(dateForCalendar || new Date()),
    [dateForCalendar]
  );

  useEffect(() => {
    dispatch(getDayWater(formattedDate));
  }, [dispatch, formattedDate]);

  const handleIsAddWater = useCallback(
    () => openAdd(formattedDate),
    [openAdd, formattedDate]
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

        <div className={styles.water_list_wrapper}>
          {isLoading ? (
            <BallTriangleLoader />
          ) : (
            <WaterList
              waterData={dayWater}
              onEdit={openEdit}
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
