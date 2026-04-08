import { useNavigate } from 'react-router-dom';

import Cookie from 'js-cookie';

import TOKEN_KEY, {
  CURRENT_GROUP_ID_KEY,
  CURRENT_USER_ID_KEY,
} from '@/constants/auth';

function useLogout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookie.remove(TOKEN_KEY);
    window.localStorage.removeItem(CURRENT_USER_ID_KEY);
    window.localStorage.removeItem(CURRENT_GROUP_ID_KEY);
    navigate('/login');
  };

  return handleLogout;
}

export default useLogout;
