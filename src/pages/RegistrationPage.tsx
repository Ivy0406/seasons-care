import RegisterAccount from '@/features/auth/components/RegisterAccount';
import SetupProfile from '@/features/auth/components/SetupProfile';
import useRegister from '@/features/auth/hooks/useRegister';

function RegistrationPage() {
  const { step, isLoading, handleAccountNext, handleProfileSubmit } =
    useRegister();

  return (
    <main className="w-full bg-neutral-100">
      <div className="mx-auto flex h-screen w-full max-w-200 items-center justify-center px-6">
        {step === 'account' && (
          <RegisterAccount onNext={handleAccountNext} isLoading={isLoading} />
        )}
        {step === 'profile' && (
          <SetupProfile onSubmit={handleProfileSubmit} isLoading={isLoading} />
        )}
      </div>
    </main>
  );
}

export default RegistrationPage;
