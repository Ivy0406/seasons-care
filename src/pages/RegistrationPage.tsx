import { useState } from 'react';

import { useNavigate } from 'react-router';

import RegisterAccount from '@/features/auth/components/RegisterAccount';
import SetupProfile from '@/features/auth/components/SetupProfile';

type RegistrationData = {
  account?: string;
  password?: string;
  name?: string;
  avatar?: string;
};

function RegistrationPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [registrationData, setRegistrationData] = useState<RegistrationData>(
    {},
  );

  const handleAccountNext = (data: { account: string; password: string }) => {
    setRegistrationData((prev) => ({ ...prev, ...data }));
    setStep(2);
  };

  const handleProfileSubmit = (profileData: {
    name: string;
    avatar: string;
  }) => {
    const finalData = {
      ...registrationData,
      ...profileData,
    };
    console.log('完成註冊，打 API 送出資料：', finalData);
    navigate('/onboarding');
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      {step === 1 && <RegisterAccount onNext={handleAccountNext} />}
      {step === 2 && <SetupProfile onSubmit={handleProfileSubmit} />}
    </div>
  );
}

export default RegistrationPage;
