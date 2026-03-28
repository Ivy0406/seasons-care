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
  data: {
    token: string;
    user: UserInfo;
  };
  traceId: string;
};

export type {
  RegisterPayload,
  LoginPayload,
  SetupProfilePayload,
  UserInfo,
  LoginResponse,
};
