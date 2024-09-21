import Message from 'components/Message/Message';
import { Suspense } from 'react';
import { Outlet } from 'react-router';

const SharedLayout = ({ children }) => {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        {children}
        <Outlet />
        <Message />
      </Suspense>
    </main>
  );
};

export default SharedLayout;
