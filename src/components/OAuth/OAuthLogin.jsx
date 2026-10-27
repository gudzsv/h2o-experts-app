import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useSearchParams } from 'react-router-dom';
import { loginOAuth } from '../../redux/auth/operations';
import { selectIsLoggedIn } from '../../redux/auth/selectors';

export const OAuthLogin = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const isCodeSent = useRef(false);

  useEffect(() => {
    // The code is single-use: StrictMode runs effects twice in development.
    if (!code || isCodeSent.current) {
      return;
    }

    isCodeSent.current = true;
    dispatch(loginOAuth(code));
  }, [code, dispatch]);

  if (!code) {
    return <Navigate to={'/signin'} />;
  }

  return <>{isLoggedIn && <Navigate to={'/tracker'} />}</>;
};

export default OAuthLogin;
