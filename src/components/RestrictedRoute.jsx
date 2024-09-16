import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectIsLoggedIn, selectToken } from '../redux/auth/selectors';
import Loader from './Loader/Loader';

const RestrictedRoute = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const token = useSelector(selectToken);

  if (token && !isLoggedIn) {
    return <Loader />;
  }

  if (token && isLoggedIn) {
    return <Navigate to={'/tracker'} />;
  }

  return <Outlet />;
};

export default RestrictedRoute;
