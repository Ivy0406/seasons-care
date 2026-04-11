import LoginForm from '@/features/auth/components/LoginForm';

function LoginPage() {
  return (
    <main className="w-full bg-neutral-100">
      <div className="flex h-screen w-full max-w-200 items-center justify-center px-6">
        <LoginForm />
      </div>
    </main>
  );
}

export default LoginPage;
