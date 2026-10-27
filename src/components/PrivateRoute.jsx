import { useSelector } from 'react-redux';
import { selectIsLoggedIn, selectToken } from '../redux/auth/selectors';
import Loader from './Loader/Loader';
import ReminderScheduler from './ReminderScheduler/ReminderScheduler.jsx';
import { Navigate, Outlet } from 'react-router';

export const PrivateRoute = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const token = useSelector(selectToken);

  if (!isLoggedIn && token) {
    return <Loader />;
  }

  if (!isLoggedIn && !token) {
    return <Navigate to={'/signin'} />;
  }

  return (
    <>
      <ReminderScheduler />
      <Outlet />
    </>
  );
};

export default PrivateRoute;
