import { useState } from 'react';

import BaseDrawer from '@/components/common/BaseDrawer';

import GroupEntranceLayout from './components/GroupEntranceLayout';
import GroupEntryDrawer from './components/GroupEntryDrawer';

function GroupEntrancePage() {
  const [isGroupEntryDrawerOpen, setIsGroupEntryDrawerOpen] = useState(false);

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
        />
      </BaseDrawer>
    </>
  );
}

export default GroupEntrancePage;
