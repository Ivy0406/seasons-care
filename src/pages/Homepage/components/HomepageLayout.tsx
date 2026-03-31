import { useState } from 'react';

import { ChevronDown, Mic } from 'lucide-react';

import BaseDrawer from '@/components/common/BaseDrawer';
import { CircleButtonPrimary } from '@/components/common/CircleIButton';
import Modal from '@/components/common/Modal';
import { NavigationTopActions } from '@/components/common/NavigationBar';
import SingleAvatar from '@/components/common/SingleAvatar';
import UserGroup from '@/components/common/UserGroup';
import GroupActionDrawer from '@/features/groups/components/GroupActionDrawer';
import GroupEntryDrawer from '@/features/groups/components/GroupEntryDrawer';
import GroupInviteDrawer from '@/features/groups/components/GroupInviteDrawer';
import GroupJoinDrawer from '@/features/groups/components/GroupJoinDrawer';
import GroupManagementDrawer from '@/features/groups/components/GroupManagementDrawer';
import GroupMemberManagementDrawer from '@/features/groups/components/GroupMemberManagementDrawer';
import mockGroups, {
  type CareGroup,
  type GroupMember,
} from '@/features/groups/data/mockGroups';
import RecordingDrawer from '@/features/voice/components/RecordingDrawer';

import HealthSummary from '../../../features/health/HealthSummary';

import DiarySummary from './DiarySummary';
import MoneySummary from './MoneySummary';
import WeekStrip from './WeekStrip';

function HomepageLayout() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMoney, setShowMoney] = useState(false);
  const [groups, setGroups] = useState<CareGroup[]>(mockGroups);
  const [isHomepageGroupDrawerOpen, setIsHomepageGroupDrawerOpen] =
    useState(false);
  const [isGroupEntryDrawerOpen, setIsGroupEntryDrawerOpen] = useState(false);
  const [groupEntryMode, setGroupEntryMode] = useState<'create' | 'edit'>(
    'create',
  );
  const [isGroupInviteDrawerOpen, setIsGroupInviteDrawerOpen] = useState(false);
  const [isGroupJoinDrawerOpen, setIsGroupJoinDrawerOpen] = useState(false);
  const [isGroupActionDrawerOpen, setIsGroupActionDrawerOpen] = useState(false);
  const [isGroupMemberDrawerOpen, setIsGroupMemberDrawerOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(
    mockGroups.find((group) => group.isSelected)?.id ?? mockGroups[0]?.id ?? '',
  );
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [pendingDeleteMember, setPendingDeleteMember] = useState<{
    groupId: string;
    member: GroupMember;
  } | null>(null);
  const [deletedMemberName, setDeletedMemberName] = useState<string | null>(
    null,
  );

  const selectedGroup =
    groups.find((group) => group.id === selectedGroupId) ?? groups[0];
  const activeGroup =
    activeGroupId === null
      ? selectedGroup
      : (groups.find((group) => group.id === activeGroupId) ?? selectedGroup);

  const handleGroupActionDrawerChange = (open: boolean) => {
    setIsGroupActionDrawerOpen(open);

    if (!open) {
      setActiveGroupId(null);
    }
  };

  const handleGroupMemberDrawerChange = (open: boolean) => {
    setIsGroupMemberDrawerOpen(open);

    if (!open) {
      setActiveGroupId(null);
    }
  };

  const handleOpenGroupActions = (groupId: string) => {
    setActiveGroupId(groupId);
    setIsHomepageGroupDrawerOpen(false);
    setIsGroupEntryDrawerOpen(false);
    setIsGroupInviteDrawerOpen(false);
    setIsGroupJoinDrawerOpen(false);
    setIsGroupMemberDrawerOpen(false);
    setIsGroupActionDrawerOpen(true);
  };

  const handleOpenGroupJoin = () => {
    setIsHomepageGroupDrawerOpen(false);
    setIsGroupEntryDrawerOpen(false);
    setIsGroupInviteDrawerOpen(false);
    setIsGroupActionDrawerOpen(false);
    setIsGroupMemberDrawerOpen(false);
    setIsGroupJoinDrawerOpen(true);
  };

  const handleOpenGroupCreate = () => {
    setIsHomepageGroupDrawerOpen(false);
    setGroupEntryMode('create');
    setIsGroupInviteDrawerOpen(false);
    setIsGroupJoinDrawerOpen(false);
    setIsGroupActionDrawerOpen(false);
    setIsGroupMemberDrawerOpen(false);
    setIsGroupEntryDrawerOpen(true);
  };

  const handleOpenGroupEdit = () => {
    setIsHomepageGroupDrawerOpen(false);
    setGroupEntryMode('edit');
    setIsGroupInviteDrawerOpen(false);
    setIsGroupJoinDrawerOpen(false);
    setIsGroupActionDrawerOpen(false);
    setIsGroupMemberDrawerOpen(false);
    setIsGroupEntryDrawerOpen(true);
  };

  const handleOpenGroupInvite = () => {
    setIsHomepageGroupDrawerOpen(false);
    setIsGroupEntryDrawerOpen(false);
    setIsGroupJoinDrawerOpen(false);
    setIsGroupActionDrawerOpen(false);
    setIsGroupMemberDrawerOpen(false);
    setIsGroupInviteDrawerOpen(true);
  };

  const handleOpenGroupMembers = () => {
    setIsGroupActionDrawerOpen(false);
    setIsGroupEntryDrawerOpen(false);
    setIsGroupInviteDrawerOpen(false);
    setIsGroupJoinDrawerOpen(false);
    setIsGroupMemberDrawerOpen(true);
  };

  const handleRequestDeleteMember = (groupId: string, member: GroupMember) => {
    setIsGroupMemberDrawerOpen(false);
    setPendingDeleteMember({ groupId, member });
  };

  const handleConfirmDeleteMember = () => {
    if (pendingDeleteMember === null) return;

    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === pendingDeleteMember.groupId
          ? {
              ...group,
              members: group.members.filter(
                (member) => member.id !== pendingDeleteMember.member.id,
              ),
            }
          : group,
      ),
    );
    setDeletedMemberName(pendingDeleteMember.member.name);
    setPendingDeleteMember(null);
  };

  const handleCancelDeleteMember = () => {
    setPendingDeleteMember(null);
    setIsGroupMemberDrawerOpen(true);
  };

  return (
    <>
      <main className="flex min-h-screen w-full flex-col pt-4 pb-10 text-neutral-900">
        <NavigationTopActions hasNotification className="px-0" />

        <section className="flex flex-col">
          <button
            type="button"
            onClick={() => setIsHomepageGroupDrawerOpen(true)}
            className="flex w-fit items-center gap-2 py-2 text-left"
            aria-label="開啟群組總覽"
          >
            <h1 className="font-heading-lg">{selectedGroup.name}</h1>
            <ChevronDown className="size-6 shrink-0" strokeWidth={2} />
          </button>

          <div className="flex items-center justify-between gap-4">
            <div className="font-label-md flex items-end gap-1">
              <span className="">照護第</span>
              <span className="font-label-md relative inline-block px-1 leading-none">
                <span className="bg-primary-default absolute inset-x-0 bottom-0 h-[45%]" />
                <span className="font-heading-lg relative">125</span>
              </span>
              <span className="">天</span>
            </div>

            <UserGroup>
              {selectedGroup.members.map((member) => (
                <SingleAvatar
                  key={member.id}
                  src={member.avatarSrc}
                  name={member.name}
                  className="size-8 bg-neutral-300"
                />
              ))}
            </UserGroup>
          </div>
        </section>

        <section className="mt-5 overflow-hidden rounded-sm border-2 border-neutral-900 bg-neutral-50">
          <div className="bg-primary-default px-3 py-3">
            <p className="font-label-md">王希銘，你好</p>
            <p className="font-paragraph-md">今天想要記錄什麼資訊呢？</p>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 px-3 pb-3">
            <p className="font-paragraph-md text-neutral-700">
              今日要去回診...
            </p>
            <RecordingDrawer
              trigger={
                <CircleButtonPrimary size="md" aria-label="開始語音輸入">
                  <Mic />
                </CircleButtonPrimary>
              }
            />
          </div>
        </section>
        <section className="bg-secondary-default -mx-6 mt-5 rounded-t-xl border-2 border-neutral-900 px-6 py-5">
          <WeekStrip selected={selectedDate} onSelect={setSelectedDate} />
          {showMoney ? (
            <MoneySummary onSwitchToDiary={() => setShowMoney(false)} />
          ) : (
            <DiarySummary onSwitchToMoney={() => setShowMoney(true)} />
          )}
          <HealthSummary />
        </section>
      </main>

      <BaseDrawer
        open={isHomepageGroupDrawerOpen}
        onOpenChange={setIsHomepageGroupDrawerOpen}
      >
        <GroupManagementDrawer
          groups={groups}
          selectedGroupId={selectedGroupId}
          onSelectGroup={setSelectedGroupId}
          onManageGroup={handleOpenGroupActions}
          onJoinGroup={handleOpenGroupJoin}
          onCreateGroup={handleOpenGroupCreate}
        />
      </BaseDrawer>

      <BaseDrawer
        open={isGroupEntryDrawerOpen}
        onOpenChange={setIsGroupEntryDrawerOpen}
      >
        <GroupEntryDrawer
          open={isGroupEntryDrawerOpen}
          onClose={() => setIsGroupEntryDrawerOpen(false)}
          onInviteMembers={handleOpenGroupInvite}
          initialStep="create"
          mode={groupEntryMode}
          initialGroupName={groupEntryMode === 'edit' ? activeGroup?.name : ''}
        />
      </BaseDrawer>

      <GroupInviteDrawer
        open={isGroupInviteDrawerOpen}
        onOpenChange={setIsGroupInviteDrawerOpen}
      />

      <GroupJoinDrawer
        open={isGroupJoinDrawerOpen}
        onOpenChange={setIsGroupJoinDrawerOpen}
      />

      <GroupActionDrawer
        open={isGroupActionDrawerOpen}
        groupName={activeGroup?.name}
        onOpenChange={handleGroupActionDrawerChange}
        onManageMembers={handleOpenGroupMembers}
        onEditGroup={handleOpenGroupEdit}
      />

      <GroupMemberManagementDrawer
        open={isGroupMemberDrawerOpen}
        group={activeGroup}
        onOpenChange={handleGroupMemberDrawerChange}
        onRequestDeleteMember={handleRequestDeleteMember}
        onInviteMembers={handleOpenGroupInvite}
      />

      <Modal
        open={pendingDeleteMember !== null}
        title="是否要刪除此成員"
        confirmText="刪除"
        cancelText="取消"
        onClose={handleCancelDeleteMember}
        onCancel={handleCancelDeleteMember}
        onConfirm={handleConfirmDeleteMember}
      />

      <Modal
        open={deletedMemberName !== null}
        title="刪除成員"
        description={
          deletedMemberName ? `${deletedMemberName} 已從群組中移除` : undefined
        }
        variant="success"
        autoCloseMs={1200}
        onClose={() => setDeletedMemberName(null)}
      />
    </>
  );
}

export default HomepageLayout;
