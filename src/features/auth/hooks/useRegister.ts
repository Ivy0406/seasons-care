import { useState } from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { register, type RegisterPayload } from '@/api/endpoints/auth';

type AccountData = {
  account: string;
  password: string;
};

type ProfileData = {
  name: string;
  avatar: string;
};

type RegistrationStep = 'account' | 'profile';

const useRegister = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<RegistrationStep>('account');
  const [accountData, setAccountData] = useState<Partial<AccountData>>({});

  const handleAccountNext = (data: AccountData) => {
    setAccountData(data);
    setStep('profile');
  };

  const handleProfileSubmit = async (profileData: ProfileData) => {
    const { account, password } = accountData;
    if (!account || !password) return;

    const payload: RegisterPayload = {
      userName: profileData.name,
      email: account,
      password,
      avatar: profileData.avatar,
    };

    setIsLoading(true);
    try {
      await register(payload);
      navigate('/onboarding');
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
    } finally {
      setIsLoading(false);
    }
  };

  return { step, isLoading, handleAccountNext, handleProfileSubmit };
};

export default useRegister;
