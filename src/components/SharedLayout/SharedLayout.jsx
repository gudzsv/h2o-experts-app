import Loader from 'components/Loader/Loader.jsx';
import Message from 'components/Message/Message';
import { Suspense } from 'react';
import { Outlet } from 'react-router';

const SharedLayout = ({ children }) => {
  return (
    <main>
      <Suspense fallback={<Loader />}>
        {children}
        <Outlet />
        <Message />
      </Suspense>
    </main>
  );
};

export default SharedLayout;
