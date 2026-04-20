type RegisterPayload = {
  email: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type SetupProfilePayload = {
  userName: string;
  avatarKey: string;
};

type UserInfo = {
  id: string;
  email: string;
  userName: string;
  avatarKey: string;
  isProfileCompleted: boolean;
};

type LoginResponse = {
  success: boolean;
  message: string;
  traceId: string;
  data: {
    token: string;
    user: UserInfo;
    careGroupCount: number;
    defaultCareGroupId: string | null;
  };
};

export type {
  RegisterPayload,
  LoginPayload,
  SetupProfilePayload,
  UserInfo,
  LoginResponse,
};
