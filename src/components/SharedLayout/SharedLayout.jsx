import { Suspense } from 'react';
import { Outlet } from 'react-router';

const SharedLayout = ({ children }) => {
  return (
    <div>
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          {children}
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};

export default SharedLayout;
