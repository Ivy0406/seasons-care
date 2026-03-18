import { createHashRouter } from 'react-router';

import App from '@/App';
import HomepagePage from '@/pages/Homepage';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
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
        path: 'homepage',
        Component: HomepagePage,
      },
    ],
  },
]);

export default router;
