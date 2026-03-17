import { useState } from 'react';

import BaseDrawer from '@/components/ui/BaseDrawer';

import GroupEntryDrawer from './components/GroupEntryDrawer';
import GroupEntranceLayout from './components/GroupEntranceLayout';

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
