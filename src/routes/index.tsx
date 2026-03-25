import { createHashRouter } from 'react-router';

import App from '@/App';
import Calendar from '@/components/ui/calendar';
import CalendarPage from '@/pages/CalendarPage';
import GroupEntrancePage from '@/pages/GroupEntrance/GroupEntrancePage';
import HealthReportPage from '@/pages/HealthReport/HealthReportPage';
import HomepagePage from '@/pages/Homepage/HomepagePage';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import OnboardingPage from '@/pages/OnboardingPage';
import RegistrationPage from '@/pages/RegistrationPage';

const router = createHashRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        index: true,
        Component: LandingPage,
      },
      {
        path: 'login',
        Component: LoginPage,
      },
      {
        path: 'registration',
        Component: RegistrationPage,
      },
      {
        path: 'onboarding',
        Component: OnboardingPage,
      },
      {
        path: 'group-entrance',
        Component: GroupEntrancePage,
      },
      {
        path: 'homepage',
        Component: HomepagePage,
      },
      {
        path: 'health-report',
        Component: HealthReportPage,
      },
      {
        path: 'calendar',
        Component: Calendar,
      },
      {
        path: 'calendar-page',
        Component: CalendarPage,
      },
    ],
  },
]);

export default router;
