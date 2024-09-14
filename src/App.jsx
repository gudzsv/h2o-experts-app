import Loader from 'components/Loader/Loader.jsx';
import PrivateRoute from 'components/PrivateRoute.jsx';
import RestrictedRoute from 'components/RestrictedRoute.jsx';
import SharedLayout from 'components/SharedLayout/SharedLayout.jsx';
import { lazy, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route } from 'react-router';
import { refreshUser } from './redux/auth/operations.js';
import { selectIsRefreshing } from './redux/auth/selectors.js';

const HomePage = lazy(() => import('./pages/HomePage/HomePage.jsx'));
const SignInPage = lazy(() => import('./pages/SignInPage/SignInPage.jsx'));
const SignUpPage = lazy(() => import('./pages/SignUpPage/SignUpPage.jsx'));
const TrackerPage = lazy(() => import('./pages/TrackerPage/TrackerPage.jsx'));
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage/NotFoundPage.jsx')
);

function App() {
  const dispatch = useDispatch();
  const isRefreshing = useSelector(selectIsRefreshing);

  useEffect(() => {
    dispatch(refreshUser());
  }, [dispatch]);

  return isRefreshing ? (
    <Loader />
  ) : (
    <SharedLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<RestrictedRoute />}>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/tracker" element={<TrackerPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </SharedLayout>
  );
}

export default App;

// <PrivateRoute redirectTo="/signin" component={<TrackerPage />} />
