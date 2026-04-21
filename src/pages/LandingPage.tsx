import { useNavigate } from 'react-router';

import {
  RoundedButtonPrimary,
  RoundedButtonSecondary,
} from '@/components/common/RoundedButtons';
import { LandingKeyVisual } from '@/features/auth';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-15">
      <LandingKeyVisual />
      <div className="flex w-full flex-col items-center gap-3">
        <RoundedButtonPrimary onClick={() => navigate('login')}>
          登入
        </RoundedButtonPrimary>
        <RoundedButtonSecondary onClick={() => navigate('registration')}>
          註冊
        </RoundedButtonSecondary>
      </div>
    </div>
  );
}

export default LandingPage;
