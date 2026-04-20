import { useEffect } from 'react';

import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';

import {
  RoundedButtonPrimary,
  RoundedButtonSecondary,
} from '@/components/common/RoundedButtons';
import TOKEN_KEY, { CURRENT_GROUP_ID_KEY } from '@/constants/auth';
import { LandingKeyVisual } from '@/features/auth';

function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get(TOKEN_KEY);
    if (!token) return;

    const groupId = localStorage.getItem(CURRENT_GROUP_ID_KEY);
    if (groupId) {
      navigate('/homepage', { replace: true });
    } else {
      navigate('/group-entrance', { replace: true });
    }
  }, [navigate]);

  return (
    <main className="bg-primary-default">
      <div className="mx-auto flex h-screen w-full max-w-200 flex-col justify-center gap-15 px-6">
        <LandingKeyVisual />
        <div className="flex w-full flex-col items-center gap-3">
          <RoundedButtonPrimary onClick={() => navigate('login')}>
            登入
          </RoundedButtonPrimary>
          <RoundedButtonSecondary
            className="bg-transparent"
            onClick={() => navigate('registration')}
          >
            註冊
          </RoundedButtonSecondary>
        </div>
      </div>
    </main>
  );
}

export default LandingPage;
