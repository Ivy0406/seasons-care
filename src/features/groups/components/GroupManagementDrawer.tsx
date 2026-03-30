import { Plus } from 'lucide-react';

import { CircleButtonSecondary } from '@/components/common/CircleIButton';
import { RoundedButtonPrimary } from '@/components/common/RoundedButtons';
import type { CareGroup } from '@/features/groups/data/mockGroups';

import GroupManageContent from './GroupManageContent';

type GroupManagementDrawerProps = {
  groups: CareGroup[];
  selectedGroupId: string;
  onSelectGroup: (groupId: string) => void;
  onManageGroup: (groupId: string) => void;
  onJoinGroup: () => void;
};

function GroupManagementDrawer({
  groups,
  selectedGroupId,
  onSelectGroup,
  onManageGroup,
  onJoinGroup,
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
            <CircleButtonSecondary
              size="md"
              aria-label="加入其他群組"
              className="size-8 border-0 bg-neutral-400"
            >
              <Plus />
            </CircleButtonSecondary>
            <p className="font-label-md">加入其他群組</p>
          </div>
        </button>
      </div>

      <RoundedButtonPrimary
        className="mt-5 border-2 border-neutral-900 bg-neutral-50 text-neutral-900"
        type="button"
      >
        建立新群組
      </RoundedButtonPrimary>
    </div>
  );
}

export default GroupManagementDrawer;
