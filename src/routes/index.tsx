import { createHashRouter } from 'react-router';

import App from '@/App';
import GroupEntrancePage from '@/pages/GroupEntrance/GroupEntrancePage';
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
    ],
  },
]);

export default router;
