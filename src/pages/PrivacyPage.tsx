import { useNavigate } from 'react-router-dom';

import { NavigationSubheader } from '@/components/common/NavigationBar';
import Privacy from '@/features/settings/privacy';

function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-100">
      <NavigationSubheader
        className="mx-auto max-w-200"
        layout="centered"
        title="隱私權與免責聲明"
        showChevron={false}
        onBackClick={() => navigate(-1)}
      />
      <Privacy />
    </div>
  );
}

export default PrivacyPage;
