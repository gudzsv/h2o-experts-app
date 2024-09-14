import { useSelector } from 'react-redux';
import { selectIsLoggedIn, selectToken } from '../redux/auth/selectors';
import Loader from './Loader/Loader';
import { Navigate, Outlet } from 'react-router';

export const PrivateRoute = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const token = useSelector(selectToken);

  if (!isLoggedIn && token) {
    return <Loader />;
  }

  if (!isLoggedIn && !token) {
    return <Navigate to={'/login'} />;
  }

  return <Outlet />;
};

export default PrivateRoute;
