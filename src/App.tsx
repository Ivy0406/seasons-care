import { useState } from 'react';

import './assets/styles/index.css';
import { GroupSwitcherDrawer } from '@/components/ui/GroupSwitcherDrawer';

const MOCK_GROUPS = [
  { id: '1', name: '王家照護群組', memberCount: 4 },
  { id: '2', name: '李奶奶的小隊', memberCount: 2 },
  { id: '3', name: '陳爸爸照護團', memberCount: 6 },
];

function App() {
  const [activeGroupId, setActiveGroupId] = useState('1');

  const activeGroup = MOCK_GROUPS.find((g) => g.id === activeGroupId);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-neutral-100 p-6">
      <p className="text-sm text-neutral-500">目前群組：{activeGroup?.name}</p>

      <GroupSwitcherDrawer
        trigger={
          <button
            type="button"
            className="rounded-2xl border-2 border-neutral-900 bg-white px-6 py-3 font-semibold text-neutral-900 shadow-sm transition active:bg-neutral-100"
          >
            切換照護群組 ↑
          </button>
        }
        groups={MOCK_GROUPS}
        activeGroupId={activeGroupId}
        onSelectGroup={setActiveGroupId}
        onJoinGroup={() => alert('加入其他群組')}
        onCreateGroup={() => alert('建立新群組')}
      />
    </div>
  );
}

export default App;
