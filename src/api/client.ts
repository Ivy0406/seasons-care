import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('userToken');
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
      switch (error.response.status) {
        case 401:
          toast.error('登入已過期，請重新登入');
          Cookies.remove('userToken');
          window.location.href = '/#/login';
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
