import { useNavigate } from 'react-router-dom';

import { NavigationSubheader } from '@/components/common/NavigationBar';
import { CURRENT_USER_KEY } from '@/constants/auth';
import UpdateProfile from '@/features/settings/updateProfile';
import type { UserInfo } from '@/types/auth';

function getCurrentUser(): UserInfo | null {
  const raw = window.localStorage.getItem(CURRENT_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserInfo;
  } catch {
    return null;
  }
}

function UpdateProfilePage() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  return (
    <div className="min-h-screen bg-neutral-100">
      <NavigationSubheader
        className="mx-auto max-w-200"
        layout="centered"
        title="編輯個人資料"
        showChevron={false}
        onBackClick={() => navigate(-1)}
      />
      <UpdateProfile
        defaultName={user?.userName}
        defaultAvatarKey={user?.avatarKey}
        onSuccess={() => navigate(-1)}
      />
    </div>
  );
}

export default UpdateProfilePage;
