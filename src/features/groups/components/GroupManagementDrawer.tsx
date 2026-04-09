import { Plus } from 'lucide-react';

import { RoundedButtonPrimary } from '@/components/common/RoundedButtons';
import type { CareGroupInfo } from '@/types/group';

import GroupManageContent from './GroupManageContent';

type GroupManagementDrawerProps = {
  groups: CareGroupInfo[];
  selectedGroupId: string;
  onSelectGroup: (groupId: string) => void;
  onManageGroup: (groupId: string) => void;
  onJoinGroup: () => void;
  onCreateGroup: () => void;
};

function GroupManagementDrawer({
  groups,
  selectedGroupId,
  onSelectGroup,
  onManageGroup,
  onJoinGroup,
  onCreateGroup,
}: GroupManagementDrawerProps) {
  return (
    <div className="flex min-h-48 flex-col text-neutral-900">
      <div className="divide-y divide-neutral-400 overflow-hidden rounded-lg">
        {groups.map((group) => (
          <GroupManageContent
            key={group.id}
            group={group}
            isSelected={group.id === selectedGroupId}
            onSelect={() => onSelectGroup(group.id)}
            onManage={() => onManageGroup(group.id)}
          />
        ))}

        <button
          type="button"
          className="flex w-full items-center justify-between gap-4 bg-neutral-300 px-4 py-3 text-left"
          onClick={onJoinGroup}
        >
          <div className="flex items-center gap-2">
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-neutral-400 text-neutral-900">
              <Plus />
            </span>
            <p className="font-label-md">加入其他群組</p>
          </div>
        </button>
      </div>

      <RoundedButtonPrimary
        className="mt-5 border-2 border-neutral-900 bg-neutral-50 text-neutral-900"
        type="button"
        onClick={onCreateGroup}
      >
        建立新群組
      </RoundedButtonPrimary>
    </div>
  );
}

export default GroupManagementDrawer;
