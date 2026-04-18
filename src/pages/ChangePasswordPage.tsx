import { useNavigate } from 'react-router-dom';

import { NavigationSubheader } from '@/components/common/NavigationBar';
import ChangePassword from '@/features/settings/changePassword';

function ChangePasswordPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-100">
      <NavigationSubheader
        layout="centered"
        title="變更密碼"
        showChevron={false}
        onBackClick={() => navigate(-1)}
      />
      <ChangePassword />
    </div>
  );
}

export default ChangePasswordPage;
