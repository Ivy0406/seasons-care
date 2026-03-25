import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('userToken');
    if (token) {
      config.headers.set('Authorization', token);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default apiClient;
