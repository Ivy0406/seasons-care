import { useNavigate } from 'react-router-dom';

import { NavigationSubheader } from '@/components/common/NavigationBar';
import ResetPassword from '@/features/settings/resetPassword';

function ResetPasswordPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-100">
      <NavigationSubheader
        className="mx-auto max-w-200"
        layout="centered"
        title="重設密碼"
        showChevron={false}
        onBackClick={() => navigate(-1)}
      />
      <ResetPassword />
    </div>
  );
}

export default ResetPasswordPage;
