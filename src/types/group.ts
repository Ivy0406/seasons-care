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
  traceId: string;
};

type GetGroupsResponse = {
  data: CareGroupInfo[];
};

export type {
  CreateGroupPayload,
  CareGroupInfo,
  CreateGroupResponse,
  GetGroupsResponse,
};
