import { useState } from 'react';

import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { login } from '@/api/endpoints/auth';
import {
  TOKEN_KEY,
  CURRENT_USER_KEY,
  CURRENT_GROUP_ID_KEY,
} from '@/constants/auth';

type LoginData = {
  account: string;
  password: string;
};

const useLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: LoginData) => {
    setIsLoading(true);
    try {
      const res = await login({
        email: data.account,
        password: data.password,
      });
      const { token, careGroupCount, defaultCareGroupId, user } = res.data.data;
      Cookies.set(TOKEN_KEY, token, { expires: 100 });
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      if (defaultCareGroupId) {
        localStorage.setItem(CURRENT_GROUP_ID_KEY, defaultCareGroupId);
      }
      if (careGroupCount === 0) {
        navigate('/group-entrance');
      } else {
        navigate('/homepage');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail;
        if (detail) {
          toast.error(detail);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleLogin };
};

export default useLogin;
