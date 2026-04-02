import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

import TOKEN_KEY from '@/constants/auth';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get(TOKEN_KEY);
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      const hasToken = !!Cookies.get(TOKEN_KEY);
      switch (error.response.status) {
        case 401:
          if (hasToken && !isLoginRequest) {
            toast.error('登入已過期，請重新登入');
            Cookies.remove(TOKEN_KEY);
            window.location.href = '/#/login';
          }
          break;
        case 403:
          toast.error('權限不足，無法執行此操作');
          break;
        case 500:
          toast.error('伺服器錯誤，請稍後再試');
          break;
        default:
          break;
      }
    } else if (error.request) {
      toast.error('網路連線異常，請確認網路狀態');
    }
    return Promise.reject(error);
  },
);

export default apiClient;
