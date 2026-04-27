import BaseDrawer from '@/components/common/BaseDrawer';
import Modal from '@/components/common/Modal';
import GroupActionDrawer from '@/features/groups/components/GroupActionDrawer';
import GroupEntryDrawer from '@/features/groups/components/GroupEntryDrawer';
import GroupInviteDrawer from '@/features/groups/components/GroupInviteDrawer';
import GroupJoinDrawer from '@/features/groups/components/GroupJoinDrawer';
import GroupManagementDrawer from '@/features/groups/components/GroupManagementDrawer';
import GroupMemberManagementDrawer from '@/features/groups/components/GroupMemberManagementDrawer';
import type { GroupMember, CareGroupInfo } from '@/types/group';

type HomepageGroupOverlaysProps = {
  groups: CareGroupInfo[];
  selectedGroupId: string;
  activeGroupId: string | null;
  activeGroupMembers: GroupMember[];
  activeGroup?: CareGroupInfo;
  inviteCodeFromUrl: string;
  groupEntryMode: 'create' | 'edit';
  pendingDeleteMember: {
    groupId: string;
    member: GroupMember;
  } | null;
  isLeavingCurrentGroup: boolean;
  deletedMemberName: string | null;
  deletedMemberDescription?: string;
  isHomepageGroupDrawerOpen: boolean;
  isGroupEntryDrawerOpen: boolean;
  isGroupInviteDrawerOpen: boolean;
  isGroupJoinDrawerOpen: boolean;
  isGroupActionDrawerOpen: boolean;
  isGroupMemberDrawerOpen: boolean;
  onHomepageGroupDrawerChange: (open: boolean) => void;
  onGroupEntryDrawerChange: (open: boolean) => void;
  onGroupInviteDrawerChange: (open: boolean) => void;
  onGroupJoinDrawerChange: (open: boolean) => void;
  onGroupActionDrawerChange: (open: boolean) => void;
  onGroupMemberDrawerChange: (open: boolean) => void;
  onSelectGroup: (groupId: string) => void;
  onManageGroup: (groupId: string) => void;
  onJoinGroup: () => void;
  onCreateGroup: () => void;
  onInviteMembers: (inviteCode?: string) => void;
  onEditGroup: () => void;
  onLeaveGroup: () => void;
  onRequestDeleteMember: (groupId: string, member: GroupMember) => void;
  onCloseDeleteSuccess: () => void;
  onCancelDeleteMember: () => void;
  onConfirmDeleteMember: () => void | Promise<void>;
};

function HomepageGroupOverlays({
  groups,
  selectedGroupId,
  activeGroupId,
  activeGroupMembers,
  activeGroup,
  inviteCodeFromUrl,
  groupEntryMode,
  pendingDeleteMember,
  isLeavingCurrentGroup,
  deletedMemberName,
  deletedMemberDescription,
  isHomepageGroupDrawerOpen,
  isGroupEntryDrawerOpen,
  isGroupInviteDrawerOpen,
  isGroupJoinDrawerOpen,
  isGroupActionDrawerOpen,
  isGroupMemberDrawerOpen,
  onHomepageGroupDrawerChange,
  onGroupEntryDrawerChange,
  onGroupInviteDrawerChange,
  onGroupJoinDrawerChange,
  onGroupActionDrawerChange,
  onGroupMemberDrawerChange,
  onSelectGroup,
  onManageGroup,
  onJoinGroup,
  onCreateGroup,
  onInviteMembers,
  onEditGroup,
  onLeaveGroup,
  onRequestDeleteMember,
  onCloseDeleteSuccess,
  onCancelDeleteMember,
  onConfirmDeleteMember,
}: HomepageGroupOverlaysProps) {
  return (
    <>
      <BaseDrawer
        open={isHomepageGroupDrawerOpen}
        onOpenChange={onHomepageGroupDrawerChange}
      >
        <GroupManagementDrawer
          groups={groups}
          selectedGroupId={selectedGroupId}
          onSelectGroup={onSelectGroup}
          onManageGroup={onManageGroup}
          onJoinGroup={onJoinGroup}
          onCreateGroup={onCreateGroup}
        />
      </BaseDrawer>

      <BaseDrawer
        open={isGroupEntryDrawerOpen}
        onOpenChange={onGroupEntryDrawerChange}
      >
        <GroupEntryDrawer
          open={isGroupEntryDrawerOpen}
          onClose={() => onGroupEntryDrawerChange(false)}
          onInviteMembers={onInviteMembers}
          initialStep="create"
          mode={groupEntryMode}
          groupId={groupEntryMode === 'edit' ? (activeGroup?.id ?? null) : null}
          initialGroupName={
            groupEntryMode === 'edit' ? (activeGroup?.name ?? '') : ''
          }
          initialRecipientName={
            groupEntryMode === 'edit' ? (activeGroup?.recipientName ?? '') : ''
          }
          initialRecipientGender={
            groupEntryMode === 'edit'
              ? (activeGroup?.recipientGender ?? 'male')
              : 'male'
          }
          initialRecipientBirthDate={
            groupEntryMode === 'edit' ? activeGroup?.recipientBirthDate : undefined
          }
          initialDescription={
            groupEntryMode === 'edit' ? (activeGroup?.description ?? '') : ''
          }
          initialHealthStatus={
            groupEntryMode === 'edit' ? (activeGroup?.healthStatus ?? '') : ''
          }
        />
      </BaseDrawer>

      <GroupInviteDrawer
        open={isGroupInviteDrawerOpen}
        inviteCode={activeGroup?.inviteCode}
        onOpenChange={onGroupInviteDrawerChange}
      />

      <GroupJoinDrawer
        open={isGroupJoinDrawerOpen}
        initialInviteCode={inviteCodeFromUrl}
        onOpenChange={onGroupJoinDrawerChange}
      />

      <GroupActionDrawer
        open={isGroupActionDrawerOpen}
        groupName={activeGroup?.name}
        onOpenChange={onGroupActionDrawerChange}
        onEditGroup={onEditGroup}
        onLeaveGroup={onLeaveGroup}
      />

      <GroupMemberManagementDrawer
        open={isGroupMemberDrawerOpen}
        groupId={activeGroupId}
        members={activeGroupMembers}
        onOpenChange={onGroupMemberDrawerChange}
        onRequestDeleteMember={onRequestDeleteMember}
        onInviteMembers={() => onInviteMembers()}
      />

      <Modal
        open={pendingDeleteMember !== null}
        title={isLeavingCurrentGroup ? '是否要退出群組' : '是否要刪除此成員'}
        confirmText={isLeavingCurrentGroup ? '退出群組' : '刪除'}
        cancelText="取消"
        onClose={onCancelDeleteMember}
        onCancel={onCancelDeleteMember}
        onConfirm={onConfirmDeleteMember}
      />

      <Modal
        open={deletedMemberName !== null}
        title="刪除成員"
        description={deletedMemberDescription}
        variant="success"
        autoCloseMs={1200}
        onClose={onCloseDeleteSuccess}
      />
    </>
  );
}

export default HomepageGroupOverlays;
