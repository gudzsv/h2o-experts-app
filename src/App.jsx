// import Loader from 'components/Loader/Loader.jsx';
import PrivateRoute from 'components/PrivateRoute.jsx';
import RestrictedRoute from 'components/RestrictedRoute.jsx';
import SharedLayout from 'components/SharedLayout/SharedLayout.jsx';
import { lazy, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route } from 'react-router';
import { currentUser } from './redux/auth/operations.js';
import { selectIsRefreshing } from './redux/auth/selectors.js';

const HomePage = lazy(() => import('./pages/HomePage/HomePage.jsx'));
const SignInPage = lazy(() => import('./pages/SignInPage/SignInPage.jsx'));
const SignUpPage = lazy(() => import('./pages/SignUpPage/SignUpPage.jsx'));
const TrackerPage = lazy(() => import('./pages/TrackerPage/TrackerPage.jsx'));
const OAuthPage = lazy(() => import('./pages/OAuthPage/OAuthPage.jsx'));
const ConfirmResetPwdPage = lazy(() =>
  import('./pages/ConfirmResetPwdPage/ConfirmResetPwdPage.jsx')
);
const ResetPwdPage = lazy(() =>
  import('./pages/ResetPwdPage/ResetPwdPage.jsx')
);

const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage/NotFoundPage.jsx')
);

function App() {
  const dispatch = useDispatch();
  const isRefreshing = useSelector(selectIsRefreshing);

  useEffect(() => {
    dispatch(currentUser());
  }, [dispatch]);

  return isRefreshing ? (
    <p>...Loading</p>
  ) : (
    <>
      {/* <Loader /> */}
      <SharedLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route element={<RestrictedRoute />}>
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/oauth-redirect" element={<OAuthPage />} />
            <Route path="/reset-password" element={<ResetPwdPage />} />
            <Route
              path="/confirm-reset-password"
              element={<ConfirmResetPwdPage />}
            />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/tracker" element={<TrackerPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </SharedLayout>
    </>
  );
}

export default App;

// <PrivateRoute redirectTo="/signin" component={<TrackerPage />} />
