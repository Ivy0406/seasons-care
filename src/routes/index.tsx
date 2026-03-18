import { createHashRouter } from 'react-router';

import App from '@/App';
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
    ],
  },
]);

export default router;
