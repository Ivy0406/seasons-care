import { createHashRouter } from 'react-router';

import App from '@/App';
import GroupEntrancePage from '@/pages/GroupEntrance/GroupEntrancePage';
import LandingPage from '@/pages/LandingPage';
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
        element: <div>Login Page (Comming soon)</div>,
      },
      {
        path: 'registration',
        Component: RegistrationPage,
      },
      {
        path: 'group-entrance',
        Component: GroupEntrancePage,
      },
    ],
  },
]);

export default router;
