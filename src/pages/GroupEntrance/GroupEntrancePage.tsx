import { useState } from 'react';

import { useNavigate } from 'react-router';

import BaseDrawer from '@/components/common/BaseDrawer';
import GroupEntryDrawer from '@/features/groups/components/GroupEntryDrawer';
import GroupInviteDrawer from '@/features/groups/components/GroupInviteDrawer';

import GroupEntranceLayout from './components/GroupEntranceLayout';

function GroupEntrancePage() {
  const [isGroupEntryDrawerOpen, setIsGroupEntryDrawerOpen] = useState(false);
  const [isGroupInviteDrawerOpen, setIsGroupInviteDrawerOpen] = useState(false);
  const [createdInviteCode, setCreatedInviteCode] = useState('');
  const navigate = useNavigate();

  const handleGroupInviteDrawerChange = (open: boolean) => {
    setIsGroupInviteDrawerOpen(open);

    if (!open) {
      navigate('/homepage');
    }
  };

  return (
    <>
      <GroupEntranceLayout
        onGroupEntryClick={() => setIsGroupEntryDrawerOpen(true)}
      />
      <BaseDrawer
        open={isGroupEntryDrawerOpen}
        onOpenChange={setIsGroupEntryDrawerOpen}
      >
        <GroupEntryDrawer
          open={isGroupEntryDrawerOpen}
          onClose={() => setIsGroupEntryDrawerOpen(false)}
          onInviteMembers={(inviteCode) => {
            setCreatedInviteCode(inviteCode ?? '');
            setIsGroupEntryDrawerOpen(false);
            setIsGroupInviteDrawerOpen(true);
          }}
          onComplete={() => navigate('/homepage')}
        />
      </BaseDrawer>

      <GroupInviteDrawer
        open={isGroupInviteDrawerOpen}
        onOpenChange={handleGroupInviteDrawerChange}
        inviteCode={createdInviteCode}
      />
    </>
  );
}

export default GroupEntrancePage;
