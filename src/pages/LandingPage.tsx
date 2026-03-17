import {
  RoundedButtonPrimary,
  RoundedButtonSecondary,
} from '@/components/ui/RoundedButtons';
import { LandingKeyVisual } from '@/features/auth';

function LandingPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-15">
      <LandingKeyVisual />
      <div className="flex w-full flex-col items-center gap-3">
        <RoundedButtonPrimary>登入</RoundedButtonPrimary>
        <RoundedButtonSecondary>註冊</RoundedButtonSecondary>
      </div>
    </div>
  );
}

export default LandingPage;
