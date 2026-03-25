import { useState } from 'react';

import axios from 'axios';
import { toast } from 'sonner';

import { register, type RegisterPayload } from '@/api/endpoints/auth';

const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const response = await register(payload);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        switch (error.response?.status) {
          case 400:
            toast.error('請確認填寫的資料格式是否正確');
            break;
          case 409:
            toast.error('此帳號已被註冊，請使用其他信箱');
            break;
          default:
            break;
        }
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { handleRegister, isLoading };
};

export default useRegister;
