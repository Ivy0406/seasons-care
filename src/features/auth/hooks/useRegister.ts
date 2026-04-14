import { useState } from 'react';

import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { login, register } from '@/api/endpoints/auth';
import setupProfile from '@/api/endpoints/user';
import {
  CURRENT_GROUP_ID_KEY,
  CURRENT_USER_ID_KEY,
  CURRENT_USER_KEY,
  TOKEN_KEY,
} from '@/constants/auth';
import type { UserInfo } from '@/types/auth';

type AccountData = {
  account: string;
  password: string;
};

type ProfileData = {
  name: string;
  avatarKey: string;
};

type RegistrationStep = 'account' | 'profile';

const useRegister = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<RegistrationStep>('account');

  const handleAccountNext = async (data: AccountData) => {
    setIsLoading(true);
    try {
      await register({ email: data.account, password: data.password });
      const loginRes = await login({
        email: data.account,
        password: data.password,
      });
      const { token, user, defaultCareGroupId } = loginRes.data.data;

      Cookies.set(TOKEN_KEY, token, { expires: 100 });
      window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      window.localStorage.setItem(CURRENT_USER_ID_KEY, user.id);

      if (defaultCareGroupId) {
        window.localStorage.setItem(CURRENT_GROUP_ID_KEY, defaultCareGroupId);
      } else {
        window.localStorage.removeItem(CURRENT_GROUP_ID_KEY);
      }

      setStep('profile');
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

  const handleProfileSubmit = async (profile: ProfileData) => {
    setIsLoading(true);
    try {
      await setupProfile({
        userName: profile.name,
        avatarKey: profile.avatarKey,
      });
      const currentUser: UserInfo | null = JSON.parse(
        window.localStorage.getItem(CURRENT_USER_KEY) ?? 'null',
      );

      if (currentUser) {
        window.localStorage.setItem(
          CURRENT_USER_KEY,
          JSON.stringify({
            ...currentUser,
            userName: profile.name,
            avatarKey: profile.avatarKey,
            isProfileCompleted: true,
          }),
        );
      }
      navigate('/onboarding');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error('設定個人資料失敗，請稍後再試');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { step, isLoading, handleAccountNext, handleProfileSubmit };
};

export default useRegister;
