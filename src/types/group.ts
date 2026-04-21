type CreateGroupPayload = {
  recipientName: string;
  recipientGender: string;
  recipientBirthDate: string;
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
  CareGroupInfo,
  CreateGroupResponse,
  GetMyGroupsResponse,
  GroupMember,
  CareGroupDetail,
  GetGroupDetailResponse,
};
