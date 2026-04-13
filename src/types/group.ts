type CreateGroupPayload = {
  recipientName: string;
  recipientGender: string;
  recipientBirthDate: string;
};

type UpdateGroupPayload = {
  name: string;
  recipientName: string;
  recipientGender: string;
  recipientBirthDate: string;
  description: string;
  healthStatus: string;
};

type JoinGroupPayload = {
  inviteCode: string;
};

type CareGroupInfo = {
  id: string;
  name: string;
  recipientName: string;
  recipientGender: string;
  recipientBirthDate: string;
  description: string;
  healthStatus: string;
  inviteCode: string;
  createdAt: string;
  memberCount: number;
};

type CreateGroupResponse = {
  success: boolean;
  message: string;
  data: CareGroupInfo;
};

type GetMyGroupsResponse = {
  success: boolean;
  message: string;
  data: CareGroupInfo[];
};

type UpdateGroupResponse = {
  success: boolean;
  message: string;
  data: CareGroupInfo;
};

type DeleteGroupMemberResponse = {
  success: boolean;
  message: string;
  data: null;
};

type JoinGroupResponse = {
  success: boolean;
  message: string;
  data: string;
};

type GroupMember = {
  userId: string;
  username: string;
  avatarKey: string;
  role: number;
  joinedAt: string;
};

type CareGroupDetail = CareGroupInfo & {
  members: GroupMember[];
};

type GetGroupDetailResponse = {
  success: boolean;
  message: string;
  data: CareGroupDetail;
};

export type {
  CreateGroupPayload,
  UpdateGroupPayload,
  JoinGroupPayload,
  CareGroupInfo,
  CreateGroupResponse,
  GetMyGroupsResponse,
  UpdateGroupResponse,
  DeleteGroupMemberResponse,
  JoinGroupResponse,
  GroupMember,
  CareGroupDetail,
  GetGroupDetailResponse,
};
