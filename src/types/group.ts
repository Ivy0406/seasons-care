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

type Pagination = {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};

type CreateGroupResponse = {
  success: boolean;
  message: string;
  data: CareGroupInfo;
  traceId: string;
  pagination: Pagination;
};

export type { CreateGroupPayload, CareGroupInfo, CreateGroupResponse };
