// import { PrivateRoute } from 'components/PrivateRoute.jsx';
// import RestrictedRoute from 'components/RestrictedRoute.jsx';
import SharedLayout from 'components/SharedLayout/SharedLayout.jsx';
import { lazy } from 'react';
import { Routes, Route } from 'react-router';

const HomePage = lazy(() => import('./pages/HomePage/HomePage.jsx'));
const SignInPage = lazy(() => import('./pages/SignInPage/SignInPage.jsx'));
const SignUpPage = lazy(() => import('./pages/SignUpPage/SignUpPage.jsx'));
const TrackerPage = lazy(() => import('./pages/TrackerPage/TrackerPage.jsx'));
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage/NotFoundPage.jsx')
);

function App() {
  return (
    <SharedLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/signup"
          element={
            <SignUpPage />
            // <RestrictedRoute redirectTo="/tracker" component={<SignUpPage />} />
          }
        />
        <Route
          path="/signin"
          element={
            <SignInPage />
            // <RestrictedRoute redirectTo="/tracker" component={<SignInPage />} />
          }
        />
        <Route
          path="/tracker"
          element={
            <TrackerPage />
            // <PrivateRoute redirectTo="/signin" component={<TrackerPage />} />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </SharedLayout>
  );
}

export default App;
