import Cookies from 'js-cookie';
import { Navigate, Outlet } from 'react-router';

import TOKEN_KEY from '@/constants/auth';

function AuthCheckOut() {
  const token = Cookies.get(TOKEN_KEY);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default AuthCheckOut;
