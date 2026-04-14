import { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { Mic } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';

import getAvatarSrcByKey from '@/assets/images/avatars';
import BaseDrawer from '@/components/common/BaseDrawer';
import { CircleButtonPrimary } from '@/components/common/CircleIButton';
import {
  HomepageNavigationBar,
  NavigationGroupTrigger,
} from '@/components/common/NavigationBar';
import SideMenu from '@/components/common/SideMenu';
import SingleAvatar from '@/components/common/SingleAvatar';
import UserGroup from '@/components/common/UserGroup';
import Calendar from '@/components/ui/calendar';
import { CURRENT_USER_KEY } from '@/constants/auth';
import useDeleteGroupMember from '@/features/groups/hooks/useDeleteGroupMember';
import useGetGroupMembers from '@/features/groups/hooks/useGetGroupMembers';
import useGetGroups from '@/features/groups/hooks/useGetGroups';
import RecordingDrawer from '@/features/voice/components/RecordingDrawer';
import { useVoiceInput } from '@/features/voice/VoiceInputContext';
import useCurrentGroupId from '@/hooks/useCurrentGroupID';
import type { UserInfo } from '@/types/auth';
import type { GroupMember } from '@/types/group';

import DailyOverviewTabs from './DailyOverviewTabs';
import HomepageGroupOverlays from './HomepageGroupOverlays';

function HomepageLayout() {
  const queryClient = useQueryClient();
  const { data: groups = [] } = useGetGroups();
  const { handleDeleteGroupMember } = useDeleteGroupMember();
  const { currentGroupId, setCurrentGroupId } = useCurrentGroupId();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentUser: UserInfo | null = JSON.parse(
    localStorage.getItem(CURRENT_USER_KEY) ?? 'null',
  );
  const navigate = useNavigate();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [isDateDrawerOpen, setIsDateDrawerOpen] = useState(false);
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
  const [selectedGroupId, setSelectedGroupId] = useState(currentGroupId);
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
  const { setVoiceTranscript, clearVoiceInput } = useVoiceInput();

  const selectedGroup =
    groups.find((group) => group.id === selectedGroupId) ?? groups[0];
  const inviteCodeFromUrl = searchParams.get('inviteCode')?.trim() ?? '';
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

  useEffect(() => {
    if (currentGroupId && currentGroupId !== selectedGroupId) {
      setSelectedGroupId(currentGroupId);
    }
  }, [currentGroupId, selectedGroupId]);

  useEffect(() => {
    if (inviteCodeFromUrl === '') {
      return;
    }

    setIsHomepageGroupDrawerOpen(false);
    setIsGroupEntryDrawerOpen(false);
    setIsGroupInviteDrawerOpen(false);
    setIsGroupActionDrawerOpen(false);
    setIsGroupMemberDrawerOpen(false);
    setIsGroupJoinDrawerOpen(true);
  }, [inviteCodeFromUrl]);

  const handleSelectGroup = (groupId: string) => {
    setSelectedGroupId(groupId);
    setCurrentGroupId(groupId);
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

  const clearInviteCodeFromUrl = () => {
    if (inviteCodeFromUrl === '') {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('inviteCode');
    setSearchParams(nextParams, { replace: true });
  };

  const handleGroupJoinDrawerChange = (open: boolean) => {
    setIsGroupJoinDrawerOpen(open);

    if (!open) {
      clearInviteCodeFromUrl();
    }
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
    setActiveGroupId((prev) => prev ?? selectedGroupId);
    setIsGroupActionDrawerOpen(false);
    setIsGroupEntryDrawerOpen(false);
    setIsGroupInviteDrawerOpen(false);
    setIsGroupJoinDrawerOpen(false);
    setIsGroupMemberDrawerOpen(true);
  };

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    setIsDateDrawerOpen(false);
  };

  const handleLeaveCurrentGroup = () => {
    if (!currentUser || !activeGroup) return;

    setPendingDeleteMember({
      groupId: activeGroup.id,
      member: {
        userId: currentUser.id,
        username: currentUser.userName,
        avatarKey: currentUser.avatarKey,
        role: 0,
        joinedAt: '',
      },
    });
    setIsGroupActionDrawerOpen(false);
  };

  const handleRequestDeleteMember = (groupId: string, member: GroupMember) => {
    setIsGroupMemberDrawerOpen(false);
    setPendingDeleteMember({ groupId, member });
  };

  const handleConfirmDeleteMember = async () => {
    if (pendingDeleteMember === null) return;

    const didDelete = await handleDeleteGroupMember(
      pendingDeleteMember.groupId,
      pendingDeleteMember.member.userId,
    );

    if (!didDelete) {
      return;
    }

    const isCurrentUserLeavingCurrentGroup =
      pendingDeleteMember.member.userId === currentUser?.id &&
      pendingDeleteMember.groupId === selectedGroupId;

    setPendingDeleteMember(null);
    setDeletedMemberName(
      isCurrentUserLeavingCurrentGroup
        ? `${selectedGroup?.name ?? '群組'} 退出成功`
        : pendingDeleteMember.member.username,
    );

    if (isCurrentUserLeavingCurrentGroup) {
      await queryClient.refetchQueries({ queryKey: ['groups'] });

      const updatedGroups =
        queryClient.getQueryData<typeof groups>(['groups']) ?? [];
      const nextGroupId = updatedGroups[0]?.id ?? '';

      setCurrentGroupId(nextGroupId);
      setSelectedGroupId(nextGroupId);
      setActiveGroupId(null);
      setIsGroupActionDrawerOpen(false);
      setIsGroupMemberDrawerOpen(false);
    }
  };

  const handleCancelDeleteMember = () => {
    const isCurrentUserLeavingCurrentGroup =
      pendingDeleteMember?.member.userId === currentUser?.id &&
      pendingDeleteMember?.groupId === selectedGroupId;

    setPendingDeleteMember(null);

    if (!isCurrentUserLeavingCurrentGroup) {
      setIsGroupMemberDrawerOpen(true);
    }
  };
  let deletedMemberDescription: string | undefined;
  const isLeavingCurrentGroup =
    pendingDeleteMember?.member.userId === currentUser?.id &&
    pendingDeleteMember?.groupId === selectedGroupId;

  if (deletedMemberName) {
    deletedMemberDescription = deletedMemberName.includes('退出成功')
      ? deletedMemberName
      : `${deletedMemberName} 已從群組中移除`;
  }

  return (
    <>
      <main className="flex min-h-screen w-full flex-col pt-4 text-neutral-900">
        <HomepageNavigationBar
          hasNotification
          onMenuClick={() => setIsSideMenuOpen(true)}
          selectedDate={selectedDate}
          onDateClick={() => setIsDateDrawerOpen(true)}
          className="px-6"
        />

        <section className="flex flex-col px-6">
          <NavigationGroupTrigger
            groupName={selectedGroup?.name ?? ''}
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

            <UserGroup
              className="w-fit max-w-25 min-w-0"
              onClick={handleOpenGroupMembers}
            >
              {activeGroupMembers.map((member) => (
                <SingleAvatar
                  key={member.userId}
                  src={getAvatarSrcByKey(member.avatarKey)}
                  name={member.username}
                  className="size-7 bg-neutral-300 ring-1 ring-neutral-900"
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
          <DailyOverviewTabs selectedDate={selectedDate} />
        </section>
      </main>

      <BaseDrawer open={isDateDrawerOpen} onOpenChange={setIsDateDrawerOpen}>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelectDate}
          defaultMonth={selectedDate}
        />
      </BaseDrawer>

      <HomepageGroupOverlays
        groups={groups}
        selectedGroupId={selectedGroupId}
        activeGroupId={activeGroupId}
        activeGroupMembers={activeGroupMembers}
        activeGroup={activeGroup}
        inviteCodeFromUrl={inviteCodeFromUrl}
        groupEntryMode={groupEntryMode}
        pendingDeleteMember={pendingDeleteMember}
        isLeavingCurrentGroup={isLeavingCurrentGroup}
        deletedMemberName={deletedMemberName}
        deletedMemberDescription={deletedMemberDescription}
        isHomepageGroupDrawerOpen={isHomepageGroupDrawerOpen}
        isGroupEntryDrawerOpen={isGroupEntryDrawerOpen}
        isGroupInviteDrawerOpen={isGroupInviteDrawerOpen}
        isGroupJoinDrawerOpen={isGroupJoinDrawerOpen}
        isGroupActionDrawerOpen={isGroupActionDrawerOpen}
        isGroupMemberDrawerOpen={isGroupMemberDrawerOpen}
        onHomepageGroupDrawerChange={setIsHomepageGroupDrawerOpen}
        onGroupEntryDrawerChange={setIsGroupEntryDrawerOpen}
        onGroupInviteDrawerChange={setIsGroupInviteDrawerOpen}
        onGroupJoinDrawerChange={handleGroupJoinDrawerChange}
        onGroupActionDrawerChange={handleGroupActionDrawerChange}
        onGroupMemberDrawerChange={handleGroupMemberDrawerChange}
        onSelectGroup={handleSelectGroup}
        onManageGroup={handleOpenGroupActions}
        onJoinGroup={handleOpenGroupJoin}
        onCreateGroup={handleOpenGroupCreate}
        onInviteMembers={handleOpenGroupInvite}
        onEditGroup={handleOpenGroupEdit}
        onManageMembers={handleOpenGroupMembers}
        onLeaveGroup={handleLeaveCurrentGroup}
        onRequestDeleteMember={handleRequestDeleteMember}
        onCloseDeleteSuccess={() => setDeletedMemberName(null)}
        onCancelDeleteMember={handleCancelDeleteMember}
        onConfirmDeleteMember={handleConfirmDeleteMember}
      />

      <SideMenu open={isSideMenuOpen} onOpenChange={setIsSideMenuOpen} />
    </>
  );
}

export default HomepageLayout;
