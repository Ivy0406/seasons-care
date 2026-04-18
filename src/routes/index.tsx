import { createHashRouter } from 'react-router';

import App from '@/App';
import Calendar from '@/components/ui/calendar';
import DataFormCardCarousel from '@/features/voice/components/DataFormCardCarousel';
import CalendarPage from '@/pages/CareLog/CalendarPage';
import CareLogCreatePage from '@/pages/CareLog/CareLogCreatePage';
import ChangePasswordPage from '@/pages/ChangePasswordPage';
import GroupEntrancePage from '@/pages/GroupEntrance/GroupEntrancePage';
import HealthReportPage from '@/pages/HealthReport/HealthReportPage';
import HomepagePage from '@/pages/Homepage/HomepagePage';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import MoneyPage from '@/pages/MoneyPage';
import OnboardingPage from '@/pages/OnboardingPage';
import PrivacyPage from '@/pages/PrivacyPage';
import RegistrationPage from '@/pages/RegistrationPage';
import SettingPage from '@/pages/SettingPage';
import UpdateProfilePage from '@/pages/UpdateProfilePage';

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
      {
        path: 'calendar-page/new',
        Component: CareLogCreatePage,
      },
      {
        path: 'data-form',
        Component: DataFormCardCarousel,
      },
      {
        path: 'money',
        Component: MoneyPage,
      },
      {
        path: 'settings',
        Component: SettingPage,
      },
      {
        path: 'settings/profile',
        Component: UpdateProfilePage,
      },
      {
        path: 'settings/change-password',
        Component: ChangePasswordPage,
      },
      {
        path: 'settings/privacy',
        Component: PrivacyPage,
      },
    ],
  },
]);

export default router;
