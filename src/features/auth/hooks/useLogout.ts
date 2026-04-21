import { useNavigate } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';
import Cookie from 'js-cookie';

import TOKEN_KEY, {
  CURRENT_GROUP_ID_KEY,
  CURRENT_USER_ID_KEY,
  CURRENT_USER_KEY,
} from '@/constants/auth';

function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    Cookie.remove(TOKEN_KEY);
    window.localStorage.removeItem(CURRENT_USER_KEY);
    window.localStorage.removeItem(CURRENT_USER_ID_KEY);
    window.localStorage.removeItem(CURRENT_GROUP_ID_KEY);
    queryClient.clear();
    navigate('/');
  };

  return handleLogout;
}

export default useLogout;
