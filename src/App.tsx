import './assets/styles/index.css';

import { Outlet, useLocation } from 'react-router';

import Toaster from '@/components/ui/sonner';
import { VoiceInputProvider } from '@/features/voice/VoiceInputContext';
import cn from '@/lib/utils';

function App() {
  const { pathname } = useLocation();
  const isFullWidthRoute =
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/registration' ||
    pathname === '/onboarding' ||
    pathname === '/calendar-page' ||
    pathname === '/calendar-page/new' ||
    pathname === '/data-form' ||
    pathname === '/health-report' ||
    pathname === '/money' ||
    pathname === '/group-entrance' ||
    pathname === '/homepage' ||
    pathname === '/settings' ||
    pathname === '/settings/profile' ||
    pathname === '/settings/change-password' ||
    pathname === '/settings/privacy';

  return (
    <VoiceInputProvider>
      <div
        className={cn(
          'flex min-h-screen w-full flex-col bg-neutral-200',
          isFullWidthRoute ? '' : 'mx-auto max-w-200',
          isFullWidthRoute ? '' : 'px-6',
        )}
      >
        {/* 可放header */}
        <Outlet />
        <Toaster />
        {/* 可放footer */}
      </div>
    </VoiceInputProvider>
  );
}

export default App;
