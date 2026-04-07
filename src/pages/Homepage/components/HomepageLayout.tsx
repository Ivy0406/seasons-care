import { useState } from 'react';

import { Mic } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import avatars from '@/assets/images/avatars';
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
import { useVoiceInput } from '@/features/voice/VoiceInputContext';

import mockCurrentUser from '../data/mockCurrentUser';

import DailyOverviewTabs from './DailyOverviewTabs';

const avatarSrcByKey = {
  'Avatar-01': avatars.avatar01,
  'Avatar-02': avatars.avatar02,
  'Avatar-03': avatars.avatar03,
  'Avatar-04': avatars.avatar04,
  'Avatar-05': avatars.avatar05,
  'Avatar-06': avatars.avatar06,
} as const;

function HomepageLayout() {
  const navigate = useNavigate();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
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
  const { setVoiceTranscript, clearVoiceInput } = useVoiceInput();

  const selectedGroup =
    groups.find((group) => group.id === selectedGroupId) ?? groups[0];
  const activeGroup =
    activeGroupId === null
      ? selectedGroup
      : (groups.find((group) => group.id === activeGroupId) ?? selectedGroup);
  const currentUserAvatarSrc =
    avatarSrcByKey[mockCurrentUser.avatarKey] ?? avatars.avatar01;

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
      <main className="flex min-h-screen w-full flex-col pt-4 text-neutral-900">
        <HomepageNavigationBar
          hasNotification
          onMenuClick={() => setIsSideMenuOpen(true)}
          className="px-6"
        />

        <section className="flex flex-col px-6">
          <NavigationGroupTrigger
            groupName={selectedGroup.name}
            onClick={() => setIsHomepageGroupDrawerOpen(true)}
          />

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

        <section className="bg-primary-default mx-6 mt-5 flex gap-5 overflow-hidden rounded-xl border-2 border-neutral-900 px-3 py-5">
          <SingleAvatar
            src={currentUserAvatarSrc}
            name={mockCurrentUser.userName}
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
            {mockCurrentUser.userName}，你好 <br />
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
            onFinish={async ({ transcript }) => {
              if (transcript.trim() === '') {
                return { shouldClose: false };
              }

              const result = await setVoiceTranscript(transcript);

              if (!result.hasDetectedContent) {
                clearVoiceInput();
                toast.error(
                  '這段語音內容暫時無法辨識為健康、日誌或帳目，請重新錄製或手動輸入。',
                );
                return { shouldClose: false };
              }

              navigate('/data-form');
              return { shouldClose: true };
            }}
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
