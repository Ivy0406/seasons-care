import { useNavigate } from 'react-router';

import {
  RoundedButtonPrimary,
  RoundedButtonSecondary,
} from '@/components/common/RoundedButtons';
import { LandingKeyVisual } from '@/features/auth';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <main className="bg-neutral-100">
      <div className="mx-auto flex h-screen w-full max-w-200 flex-col justify-center gap-15 px-6">
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
    </main>
  );
}

export default LandingPage;
