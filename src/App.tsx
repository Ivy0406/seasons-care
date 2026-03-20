import './assets/styles/index.css';

import { Outlet, useLocation } from 'react-router';

import cn from '@/lib/utils';

function App() {
  const { pathname } = useLocation();
  const isCalendarRoute = pathname === '/calendar-page';

  return (
    <div
      className={cn(
        'flex min-h-screen w-full flex-col',
        isCalendarRoute ? '' : 'mx-auto max-w-200',
        isCalendarRoute ? '' : 'px-6',
      )}
    >
      {/* 可放header */}
      <Outlet />
      {/* 可放footer */}
    </div>
  );
}

export default App;
