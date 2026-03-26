import './assets/styles/index.css';

import { Outlet, useLocation } from 'react-router';

import cn from '@/lib/utils';

function App() {
  const { pathname } = useLocation();
  const isFullWidthRoute =
    pathname === '/calendar-page' ||
    pathname === '/calendar-page/new' ||
    pathname === '/data-form' ||
    pathname === '/health-report';

  return (
    <div
      className={cn(
        'flex min-h-screen w-full flex-col',
        isFullWidthRoute ? '' : 'mx-auto max-w-200',
        isFullWidthRoute ? '' : 'px-6',
      )}
    >
      {/* 可放header */}
      <Outlet />
      {/* 可放footer */}
    </div>
  );
}

export default App;
