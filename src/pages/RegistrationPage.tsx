import RegisterAccount from '@/features/auth/components/RegisterAccount';
import SetupProfile from '@/features/auth/components/SetupProfile';
import useRegister from '@/features/auth/hooks/useRegister';

function RegistrationPage() {
  const { step, isLoading, handleAccountNext, handleProfileSubmit } =
    useRegister();

  return (
    <div className="flex h-screen w-full items-center justify-center">
      {step === 'account' && <RegisterAccount onNext={handleAccountNext} />}
      {step === 'profile' && (
        <SetupProfile onSubmit={handleProfileSubmit} isLoading={isLoading} />
      )}
    </div>
  );
}

export default RegistrationPage;
