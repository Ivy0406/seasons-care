import { useNavigate } from 'react-router-dom';

import Cookie from 'js-cookie';

import TOKEN_KEY from '@/constants/auth';

function useLogout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookie.remove(TOKEN_KEY);
    navigate('/login');
  };

  return handleLogout;
}

export default useLogout;
