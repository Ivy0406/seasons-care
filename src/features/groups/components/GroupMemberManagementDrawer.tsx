import { useEffect, useState } from 'react';

import { Minus, Plus } from 'lucide-react';

import BaseDrawer from '@/components/common/BaseDrawer';
import { RoundedButtonPrimary } from '@/components/common/RoundedButtons';
import SingleAvatar from '@/components/common/SingleAvatar';
import type { CareGroup, GroupMember } from '@/features/groups/data/mockGroups';

type GroupMemberManagementDrawerProps = {
  open: boolean;
  group: CareGroup | null;
  onOpenChange: (open: boolean) => void;
  onRequestDeleteMember: (groupId: string, member: GroupMember) => void;
  onInviteMembers: () => void;
};

function GroupMemberManagementDrawer({
  open,
  group,
  onOpenChange,
  onRequestDeleteMember,
  onInviteMembers,
}: GroupMemberManagementDrawerProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const isAddMemberDisabled = (group?.members.length ?? 0) >= 4;

  useEffect(() => {
    if (!open) {
      setIsEditMode(false);
    }
  }, [open]);

  useEffect(() => {
    setIsEditMode(false);
  }, [group?.id]);

  return (
    <BaseDrawer open={open} onOpenChange={onOpenChange}>
      <div className="flex flex-col gap-5 text-neutral-900">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center">
          {isEditMode ? (
            <button
              type="button"
              className="font-paragraph-md justify-self-start text-neutral-900"
              onClick={() => setIsEditMode(false)}
            >
              返回
            </button>
          ) : (
            <div />
          )}
          <p className="font-label-lg text-center">
            {isEditMode ? '編輯成員' : '成員管理'}
          </p>
          {isEditMode ? (
            <div />
          ) : (
            <button
              type="button"
              className="font-paragraph-md justify-self-end text-neutral-900"
              onClick={() => setIsEditMode(true)}
            >
              編輯成員
            </button>
          )}
        </div>
        {isEditMode ? (
          <div className="pb-5" />
        ) : (
          <p className="font-paragraph-md text-center text-neutral-700">
            免費版群組最多包含四名成員。
          </p>
        )}
        <div className="overflow-hidden rounded-[12px] bg-neutral-300">
          {group ? (
            group.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between gap-4 border-b border-neutral-400 px-4 py-3 last:border-b-0"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <SingleAvatar
                    src={member.avatarSrc}
                    name={member.name}
                    className="size-10 bg-neutral-400 ring-2"
                  />
                  <div className="min-w-0">
                    <p className="font-paragraph-md truncate">{member.name}</p>
                  </div>
                </div>

                {isEditMode ? (
                  <button
                    type="button"
                    aria-label={`移除${member.name}`}
                    onClick={(event) => {
                      event.currentTarget.blur();

                      if (!group) return;

                      onRequestDeleteMember(group.id, member);
                    }}
                  >
                    <Minus size={16} />
                  </button>
                ) : null}
              </div>
            ))
          ) : (
            <div className="px-4 py-6 text-neutral-700">尚未選擇群組</div>
          )}
        </div>

        {isEditMode ? (
          <RoundedButtonPrimary
            type="button"
            onClick={() => setIsEditMode(false)}
          >
            完成編輯
          </RoundedButtonPrimary>
        ) : (
          <RoundedButtonPrimary
            type="button"
            className="gap-3"
            disabled={isAddMemberDisabled}
            onClick={onInviteMembers}
          >
            <Plus className="size-4" strokeWidth={3} />
            邀請成員
          </RoundedButtonPrimary>
        )}
      </div>
    </BaseDrawer>
  );
}

export default GroupMemberManagementDrawer;
