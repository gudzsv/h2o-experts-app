import Loader from 'components/Loader/Loader.jsx';
import { Suspense } from 'react';
import { Outlet } from 'react-router';

const SharedLayout = ({ children }) => {
  return (
    <main>
      <Suspense fallback={<Loader />}>
        {children}
        <Outlet />
      </Suspense>
    </main>
  );
};

export default SharedLayout;
