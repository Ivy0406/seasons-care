import { useEffect, useRef, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { Mic } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';

import getAvatarSrcByKey from '@/assets/images/avatars';
import BaseDrawer from '@/components/common/BaseDrawer';
import { CircleButtonPrimary } from '@/components/common/CircleIButton';
import FixedBottomButton from '@/components/common/FixedBottomButton';
import Modal from '@/components/common/Modal';
import {
  HomepageGroupNavigationBar,
  HomepageNavigationBar,
  NavigationGroupTrigger,
} from '@/components/common/NavigationBar';
import SideMenu from '@/components/common/SideMenu';
import SingleAvatar from '@/components/common/SingleAvatar';
import UserGroup from '@/components/common/UserGroup';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogPopup,
  AlertDialogPortal,
} from '@/components/ui/alert-dialog';
import Calendar from '@/components/ui/calendar';
import { CURRENT_USER_KEY } from '@/constants/auth';
import useDeleteGroupMember from '@/features/groups/hooks/useDeleteGroupMember';
import useGetGroupMembers from '@/features/groups/hooks/useGetGroupMembers';
import useGetGroups from '@/features/groups/hooks/useGetGroups';
import CreateHealthDataCard from '@/features/health/components/CreateDataCard';
import CreateMoneyDataCard from '@/features/money/components/CreateDataCard';
import RecordingDrawer from '@/features/voice/components/RecordingDrawer';
import { useVoiceInput } from '@/features/voice/VoiceInputContext';
import useCurrentGroupId from '@/hooks/useCurrentGroupID';
import useSnapObserver from '@/hooks/useSnapObserver';
import cn from '@/lib/utils';
import CreateCareLogDialog from '@/pages/CareLog/components/CreateCareLogDialog';
import type { CareLogEntry } from '@/pages/CareLog/types';
import createDraftCareLogEntry from '@/pages/CareLog/utils/createDraftCareLogEntry';
import useNotificationBadge from '@/pages/Notification/hooks/useNotificationBadge';
import type { UserInfo } from '@/types/auth';
import type { GroupMember } from '@/types/group';

import CreateEntryDrawer from './CreateEntryDrawer';
import DailyOverviewTabs from './DailyOverviewTabs';
import HomepageGroupOverlays from './HomepageGroupOverlays';
import OnboardingOverlay from './OnboardingOverlay';

type HomepageLayoutProps = {
  className?: string;
};

const ONBOARDING_KEY = 'hasSeenOnboarding';

function HomepageLayout({ className }: HomepageLayoutProps) {
  const queryClient = useQueryClient();
  const micButtonRef = useRef<HTMLDivElement>(null);
  const addButtonRef = useRef<HTMLDivElement>(null);
  const [showOnboarding, setShowOnboarding] = useState(
    () => localStorage.getItem(ONBOARDING_KEY) !== 'true',
  );
  const { hasUnread } = useNotificationBadge();
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
  const [isCreateEntryDrawerOpen, setIsCreateEntryDrawerOpen] = useState(false);
  const [creatingDiaryEntry, setCreatingDiaryEntry] =
    useState<CareLogEntry | null>(null);
  const [showCreateMoneyCard, setShowCreateMoneyCard] = useState(false);
  const [showCreateHealthCard, setShowCreateHealthCard] = useState(false);
  const [showQuickRecordingDrawer, setShowQuickRecordingDrawer] =
    useState(false);
  const [healthSubmitModal, setHealthSubmitModal] = useState<{
    open: boolean;
    variant: 'success' | 'error';
    title: string;
  }>({
    open: false,
    variant: 'success',
    title: '',
  });
  const [moneyCreateSuccessOpen, setMoneyCreateSuccessOpen] = useState(false);
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

  const {
    rootRef: mainRef,
    targetRef: section1Ref,
    isSnapped,
  } = useSnapObserver();

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

  const handleOpenGroupInvite = (inviteCode?: string) => {
    if (inviteCode && activeGroupId === null) {
      setActiveGroupId(selectedGroupId);
    }

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

  const handleOpenDiaryCreate = () => {
    setCreatingDiaryEntry(createDraftCareLogEntry(selectedDate));
  };

  const handleOpenMoneyCreate = () => {
    setShowCreateMoneyCard(true);
  };

  const handleOpenHealthCreate = () => {
    setShowCreateHealthCard(true);
  };

  const handleOpenVoiceCreate = () => {
    setShowQuickRecordingDrawer(true);
  };

  const handleDismissOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setShowOnboarding(false);
  };

  const handleVoiceFinish = async ({ transcript }: { transcript: string }) => {
    if (transcript.trim() === '') {
      return { shouldClose: false };
    }

    const result = await setVoiceTranscript(transcript);

    if (!result.hasDetectedContent) {
      clearVoiceInput();
      toast.error(
        '這段語音內容暫時無法辨識為健康、任務或帳目，請重新錄製或手動輸入。',
      );
      return { shouldClose: false };
    }

    navigate('/data-form');
    return { shouldClose: true };
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
      <main
        ref={mainRef}
        className={cn(
          'snap-smooth mx-auto h-screen max-w-200 snap-y snap-mandatory overflow-y-scroll bg-neutral-200 text-neutral-900 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          className,
        )}
      >
        <div className="sticky top-0 z-20 bg-neutral-200">
          {isSnapped ? (
            <HomepageGroupNavigationBar
              groupName={selectedGroup?.name ?? ''}
              hasNotification={hasUnread}
              onGroupClick={() => setIsHomepageGroupDrawerOpen(true)}
              onNotificationClick={() => navigate('/notifications')}
              onMenuClick={() => setIsSideMenuOpen(true)}
            />
          ) : (
            <HomepageNavigationBar
              hasNotification={hasUnread}
              onNotificationClick={() => navigate('/notifications')}
              onMenuClick={() => setIsSideMenuOpen(true)}
              selectedDate={selectedDate}
              onDateClick={() => setIsDateDrawerOpen(true)}
            />
          )}
        </div>

        <section
          ref={section1Ref}
          className="flex snap-start scroll-mt-15.75 flex-col pt-4"
        >
          <div className="flex flex-col px-6">
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
          </div>

          <div className="bg-primary-default mx-6 mt-5 flex gap-5 overflow-hidden rounded-xl border-2 border-neutral-900 px-3 py-5">
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
          </div>

          <div ref={micButtonRef} className="mx-6 mt-7 mb-11 flex items-center justify-between gap-3 rounded-full border-2 border-neutral-900 bg-neutral-50 p-3">
            <p className="font-label-md pl-6 text-neutral-900">
              {currentUser?.userName ?? ''}，你好 <br />
              今天想要記錄什麼照護資訊呢？
            </p>
            <CircleButtonPrimary
              size="lg"
              className="border-0 bg-neutral-800"
              aria-label="開始語音輸入"
              onClick={handleOpenVoiceCreate}
            >
              <Mic strokeWidth={1} className="stroke-[1.5]!" />
            </CircleButtonPrimary>
          </div>
        </section>

        <section className="flex h-[calc(100vh-63px)] snap-start scroll-mt-15.75 flex-col">
          <DailyOverviewTabs
            selectedDate={selectedDate}
            onCreateDiaryEntry={handleOpenDiaryCreate}
            onCreateMoneyEntry={handleOpenMoneyCreate}
            onBackToTop={() => {
              mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </section>
      </main>

      <FixedBottomButton
        ref={addButtonRef}
        label="新增"
        onClick={() => setIsCreateEntryDrawerOpen(true)}
      />

      {showOnboarding && (
        <OnboardingOverlay
          micButtonRef={micButtonRef}
          addButtonRef={addButtonRef}
          scrollContainerRef={mainRef}
          onDismiss={handleDismissOnboarding}
        />
      )}

      <CreateEntryDrawer
        open={isCreateEntryDrawerOpen}
        onOpenChange={setIsCreateEntryDrawerOpen}
        onCreateDiary={handleOpenDiaryCreate}
        onCreateMoney={handleOpenMoneyCreate}
        onCreateHealth={handleOpenHealthCreate}
        onCreateVoice={handleOpenVoiceCreate}
      />

      <CreateCareLogDialog
        entry={creatingDiaryEntry}
        onClose={() => setCreatingDiaryEntry(null)}
      />

      <AlertDialog
        open={showCreateMoneyCard}
        onOpenChange={(open) => {
          if (!open) setShowCreateMoneyCard(false);
        }}
      >
        <AlertDialogPortal>
          <AlertDialogBackdrop />
          <AlertDialogPopup className="w-[calc(100vw-32px)] max-w-140 border-0 bg-transparent p-0 shadow-none">
            <CreateMoneyDataCard
              initialDate={selectedDate}
              onClose={() => setShowCreateMoneyCard(false)}
              onSuccess={() => {
                setShowCreateMoneyCard(false);
                setMoneyCreateSuccessOpen(true);
              }}
            />
          </AlertDialogPopup>
        </AlertDialogPortal>
      </AlertDialog>

      <AlertDialog
        open={showCreateHealthCard}
        onOpenChange={(open) => {
          if (!open) setShowCreateHealthCard(false);
        }}
      >
        <AlertDialogPortal>
          <AlertDialogBackdrop />
          <AlertDialogPopup className="w-[calc(100vw-32px)] max-w-140 border-0 bg-transparent p-0 shadow-none">
            <CreateHealthDataCard
              onClose={() => setShowCreateHealthCard(false)}
              onSuccess={() => {
                setShowCreateHealthCard(false);
                setHealthSubmitModal({
                  open: true,
                  variant: 'success',
                  title: '健康數值新增成功',
                });
              }}
              onError={() =>
                setHealthSubmitModal({
                  open: true,
                  variant: 'error',
                  title: '新增失敗，請稍後再試',
                })
              }
            />
          </AlertDialogPopup>
        </AlertDialogPortal>
      </AlertDialog>

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
        onLeaveGroup={handleLeaveCurrentGroup}
        onRequestDeleteMember={handleRequestDeleteMember}
        onCloseDeleteSuccess={() => setDeletedMemberName(null)}
        onCancelDeleteMember={handleCancelDeleteMember}
        onConfirmDeleteMember={handleConfirmDeleteMember}
      />

      <SideMenu open={isSideMenuOpen} onOpenChange={setIsSideMenuOpen} />

      <RecordingDrawer
        open={showQuickRecordingDrawer}
        onOpenChange={setShowQuickRecordingDrawer}
        onFinish={handleVoiceFinish}
      />

      <Modal
        open={healthSubmitModal.open}
        variant={healthSubmitModal.variant}
        title={healthSubmitModal.title}
        statusLayout="icon-first"
        autoCloseMs={healthSubmitModal.variant === 'success' ? 1500 : undefined}
        onClose={() =>
          setHealthSubmitModal((prev) => ({ ...prev, open: false }))
        }
      />

      <Modal
        open={moneyCreateSuccessOpen}
        variant="success"
        title="帳目建立完成！"
        statusLayout="icon-first"
        autoCloseMs={1500}
        onClose={() => setMoneyCreateSuccessOpen(false)}
      />
    </>
  );
}

export default HomepageLayout;
