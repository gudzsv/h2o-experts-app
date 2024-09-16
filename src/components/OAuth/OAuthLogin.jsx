import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useSearchParams } from 'react-router-dom';
import { loginOAuth } from '../../redux/auth/operations';
import { selectIsLoggedIn } from '../../redux/auth/selectors';

export const OAuthLogin = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');

  useEffect(() => {
    dispatch(loginOAuth(code));
  });

  return <>{isLoggedIn && <Navigate to={'/tracker'} />}</>;
};

export default OAuthLogin;
