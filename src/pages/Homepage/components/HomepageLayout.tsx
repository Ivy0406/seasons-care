import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { Mic } from 'lucide-react';

import getAvatarSrcByKey from '@/assets/images/avatars';
import BaseDrawer from '@/components/common/BaseDrawer';
import { CircleButtonPrimary } from '@/components/common/CircleIButton';
import Modal from '@/components/common/Modal';
import {
  HomepageNavigationBar,
  NavigationGroupTrigger,
} from '@/components/common/NavigationBar';
import SideMenu from '@/components/common/SideMenu';
import SingleAvatar from '@/components/common/SingleAvatar';
import UserGroup from '@/components/common/UserGroup';
import { CURRENT_USER_KEY, CURRENT_GROUP_ID_KEY } from '@/constants/auth';
import GroupActionDrawer from '@/features/groups/components/GroupActionDrawer';
import GroupEntryDrawer from '@/features/groups/components/GroupEntryDrawer';
import GroupInviteDrawer from '@/features/groups/components/GroupInviteDrawer';
import GroupJoinDrawer from '@/features/groups/components/GroupJoinDrawer';
import GroupManagementDrawer from '@/features/groups/components/GroupManagementDrawer';
import GroupMemberManagementDrawer from '@/features/groups/components/GroupMemberManagementDrawer';
import useGetGroupMembers from '@/features/groups/hooks/useGetGroupMembers';
import useGetGroups from '@/features/groups/hooks/useGetGroups';
import RecordingDrawer from '@/features/voice/components/RecordingDrawer';
import type { UserInfo } from '@/types/auth';
import type { GroupMember } from '@/types/group';

import DailyOverviewTabs from './DailyOverviewTabs';

function HomepageLayout() {
  const queryClient = useQueryClient();
  const { data: groups = [] } = useGetGroups();
  const currentUser: UserInfo | null = JSON.parse(
    localStorage.getItem(CURRENT_USER_KEY) ?? 'null',
  );
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
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
    localStorage.getItem(CURRENT_GROUP_ID_KEY) ?? '',
  );
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const { data: activeGroupMembers = [] } = useGetGroupMembers(
    activeGroupId ?? selectedGroupId,
  );
  const [pendingDeleteMember, setPendingDeleteMember] = useState<{
    groupId: string;
    member: GroupMember;
  } | null>(null);
  const [deletedMemberName, setDeletedMemberName] = useState<string | null>(
    null,
  );

  const selectedGroup =
    groups.find((group) => group.id === selectedGroupId) ?? groups[0];
  const careDays = selectedGroup?.createdAt
    ? Math.floor(
        (Date.now() - new Date(selectedGroup.createdAt).getTime()) /
          (1000 * 60 * 60 * 24),
      ) + 1
    : 0;
  const activeGroup =
    activeGroupId === null
      ? selectedGroup
      : (groups.find((group) => group.id === activeGroupId) ?? selectedGroup);

  const handleSelectGroup = (groupId: string) => {
    setSelectedGroupId(groupId);
    localStorage.setItem(CURRENT_GROUP_ID_KEY, groupId);
    queryClient.invalidateQueries({ queryKey: ['health', groupId] });
  };
  const currentUserAvatarSrc = getAvatarSrcByKey(currentUser?.avatarKey ?? '');

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
    setDeletedMemberName(pendingDeleteMember.member.username);
    setPendingDeleteMember(null);
  };

  const handleCancelDeleteMember = () => {
    setPendingDeleteMember(null);
    setIsGroupMemberDrawerOpen(true);
  };

  return (
    <>
      <main className="flex min-h-screen w-full flex-col pt-4 text-neutral-900">
        <HomepageNavigationBar
          hasNotification
          onMenuClick={() => setIsSideMenuOpen(true)}
          className="px-6"
        />

        <section className="flex flex-col px-6">
          <NavigationGroupTrigger
            groupName={selectedGroup?.recipientName ?? ''}
            onClick={() => setIsHomepageGroupDrawerOpen(true)}
          />

          <div className="flex items-center justify-between gap-4">
            <div className="font-label-md flex items-end gap-1">
              <span className="">照護第</span>
              <span className="font-label-md relative inline-block px-1 leading-none">
                <span className="bg-primary-default absolute inset-x-0 bottom-0 h-[45%]" />
                <span className="font-heading-lg relative">{careDays}</span>
              </span>
              <span className="">天</span>
            </div>

            <UserGroup>
              {activeGroupMembers.map((member) => (
                <SingleAvatar
                  key={member.userId}
                  src={getAvatarSrcByKey(member.avatarKey)}
                  name={member.username}
                  className="size-8 ring-2 ring-neutral-900"
                />
              ))}
            </UserGroup>
          </div>
        </section>

        <section className="bg-primary-default mx-6 mt-5 flex gap-5 overflow-hidden rounded-xl border-2 border-neutral-900 px-3 py-5">
          <SingleAvatar
            src={currentUserAvatarSrc}
            name={currentUser?.userName ?? ''}
            className="size-18.25 ring-2 ring-neutral-900"
          />
          <div className="flex-1">
            <div className="flex flex-col">
              <p className="font-label-md self-start bg-neutral-800 px-2 py-1 text-neutral-50">
                今日分析摘要
              </p>
              <p className="font-paragraph-md min-h-30 w-full border-2 border-neutral-900 bg-neutral-50 p-3 text-neutral-900">
                下午已完成血壓測量，數值偏高，建議傍晚減少咖啡因攝取。今日復健進度已達成
                80%，再加油一點點！
              </p>
            </div>
          </div>
        </section>

        <section className="mx-6 mt-8 flex items-center justify-between gap-3 rounded-full border-2 border-neutral-900 bg-neutral-50 p-3">
          <p className="font-label-md pl-6 text-neutral-900">
            {currentUser?.userName ?? ''}，你好 <br />
            今天想要記錄什麼照護資訊呢？
          </p>
          <RecordingDrawer
            trigger={
              <CircleButtonPrimary
                size="lg"
                className="border-0 bg-neutral-800"
                aria-label="開始語音輸入"
              >
                <Mic strokeWidth={1} className="stroke-[1.5]!" />
              </CircleButtonPrimary>
            }
          />
        </section>

        <section className="flex flex-1 flex-col pt-11">
          <DailyOverviewTabs />
        </section>
      </main>

      <BaseDrawer
        open={isHomepageGroupDrawerOpen}
        onOpenChange={setIsHomepageGroupDrawerOpen}
      >
        <GroupManagementDrawer
          groups={groups}
          selectedGroupId={selectedGroupId}
          onSelectGroup={handleSelectGroup}
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
        groupId={activeGroupId}
        members={activeGroupMembers}
        onOpenChange={handleGroupMemberDrawerChange}
        onRequestDeleteMember={handleRequestDeleteMember}
        onInviteMembers={handleOpenGroupInvite}
      />

      <SideMenu open={isSideMenuOpen} onOpenChange={setIsSideMenuOpen} />

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
